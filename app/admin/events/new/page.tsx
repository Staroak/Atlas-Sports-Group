import { getAllPrograms } from '@/app/lib/queries/programs'
import { EventForm } from '../EventForm'

export default async function NewEventPage() {
  const programs = await getAllPrograms()
  return <EventForm programs={programs} />
}
