import { notFound } from 'next/navigation'
import { getProgramById } from '@/app/lib/queries/programs'
import { ProgramForm } from '../ProgramForm'

interface EditProgramPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params
  const program = await getProgramById(id)

  if (!program) {
    notFound()
  }

  return <ProgramForm program={program} />
}
