'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { GripVertical, Pencil } from 'lucide-react'
import { DeleteProgramButton } from './DeleteProgramButton'
import { reorderPrograms } from '@/app/lib/actions/programs'
import type { Program } from '@/app/lib/types/database'

interface ProgramsTableProps {
  initialPrograms: Program[]
}

export function ProgramsTable({ initialPrograms }: ProgramsTableProps) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))

    // Add a slight delay to allow the drag image to be captured
    setTimeout(() => {
      const target = e.target as HTMLElement
      target.closest('tr')?.classList.add('opacity-50')
    }, 0)
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.closest('tr')?.classList.remove('opacity-50')
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }, [draggedIndex])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    // Reorder the list
    const newPrograms = [...programs]
    const [draggedItem] = newPrograms.splice(draggedIndex, 1)
    newPrograms.splice(dropIndex, 0, draggedItem)

    setPrograms(newPrograms)
    setDraggedIndex(null)
    setDragOverIndex(null)

    // Save to database
    setIsSaving(true)
    try {
      const orderedIds = newPrograms.map(p => p.id)
      await reorderPrograms(orderedIds)
    } catch (error) {
      console.error('Failed to save order:', error)
      // Revert on error
      setPrograms(programs)
    } finally {
      setIsSaving(false)
    }
  }, [draggedIndex, programs])

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {isSaving && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700">
          Saving order...
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="w-10 px-2"></th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Program</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Ages</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
            <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {programs.map((program, index) => (
            <tr
              key={program.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing
                ${dragOverIndex === index ? 'bg-blue-50 border-t-2 border-blue-400' : ''}
                ${draggedIndex === index ? 'opacity-50' : ''}
              `}
            >
              <td className="px-2 py-4">
                <div className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">{program.name}</div>
                  <div className="text-sm text-gray-500">{program.tagline}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {program.youth_ages && <div>{program.youth_ages}</div>}
                  {program.adult_ages && <div>{program.adult_ages}</div>}
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={program.is_published ? 'default' : 'secondary'}>
                  {program.is_published ? 'Published' : 'Draft'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/programs/${program.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteProgramButton id={program.id} name={program.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
