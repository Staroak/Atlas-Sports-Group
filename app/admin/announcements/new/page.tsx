import { getAllPrograms } from '@/app/lib/queries/programs'
import { AnnouncementForm } from '../AnnouncementForm'

export default async function NewAnnouncementPage() {
  const programs = await getAllPrograms()
  return <AnnouncementForm programs={programs} />
}
