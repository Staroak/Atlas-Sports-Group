import Link from 'next/link'
import { getAllPrograms } from '@/app/lib/queries/programs'
import { Button } from '@/app/components/ui/button'
import { Plus } from 'lucide-react'
import { ProgramsTable } from './ProgramsTable'

export default async function ProgramsPage() {
  const programs = await getAllPrograms()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            Manage your sports programs. {programs.length} program{programs.length !== 1 ? 's' : ''} total.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag rows to reorder how programs appear on the public site.
          </p>
        </div>
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
        <ProgramsTable initialPrograms={programs} />
      )}
    </div>
  )
}
