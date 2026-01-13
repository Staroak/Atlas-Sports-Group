import { notFound } from 'next/navigation'
import { getAnnouncementById } from '@/app/lib/queries/announcements'
import { getAllPrograms } from '@/app/lib/queries/programs'
import { AnnouncementForm } from '../AnnouncementForm'

interface EditAnnouncementPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
  const { id } = await params
  const [announcement, programs] = await Promise.all([
    getAnnouncementById(id),
    getAllPrograms(),
  ])

  if (!announcement) {
    notFound()
  }

  return <AnnouncementForm announcement={announcement} programs={programs} />
}
