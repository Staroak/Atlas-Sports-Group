import Link from 'next/link'
import { getAllPrograms } from '@/app/lib/queries/programs'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { DeleteProgramButton } from './DeleteProgramButton'

export default async function ProgramsPage() {
  const programs = await getAllPrograms()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage your sports programs. {programs.length} program{programs.length !== 1 ? 's' : ''} total.
        </p>
        <Link href="/admin/programs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No programs yet. Create your first program to get started.</p>
          <Link href="/admin/programs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Program
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Program</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Ages</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50">
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
      )}
    </div>
  )
}
