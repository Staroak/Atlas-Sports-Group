import { notFound } from 'next/navigation'
import { getEventById } from '@/app/lib/queries/events'
import { getAllPrograms } from '@/app/lib/queries/programs'
import { EventForm } from '../EventForm'

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const [event, programs] = await Promise.all([
    getEventById(id),
    getAllPrograms(),
  ])

  if (!event) {
    notFound()
  }

  return <EventForm event={event} programs={programs} />
}
