'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Plus, X, GripVertical } from 'lucide-react'

interface ArrayFieldEditorProps {
  label: string
  name: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function ArrayFieldEditor({
  label,
  name,
  values,
  onChange,
  placeholder = 'Add item...',
}: ArrayFieldEditorProps) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...values, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="space-y-2">
        {values.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 rounded-md p-2"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
            <span className="flex-1 text-sm">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(values)} />
    </div>
  )
}
