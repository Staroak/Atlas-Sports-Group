import Link from 'next/link'
import { getAllAnnouncements } from '@/app/lib/queries/announcements'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Plus, Pencil, Pin } from 'lucide-react'
import { DeleteAnnouncementButton } from './DeleteAnnouncementButton'
import { format } from 'date-fns'

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage announcements and updates. {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} total.
        </p>
        <Link href="/admin/announcements/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Announcement
          </Button>
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No announcements yet. Create your first announcement to get started.</p>
          <Link href="/admin/announcements/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Announcement</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Created</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      {announcement.is_pinned && (
                        <Pin className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{announcement.title}</div>
                        {announcement.excerpt && (
                          <div className="text-sm text-gray-500 line-clamp-1">{announcement.excerpt}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Badge variant={announcement.is_published ? 'default' : 'secondary'}>
                        {announcement.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {announcement.is_pinned && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Pinned
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/announcements/${announcement.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteAnnouncementButton id={announcement.id} title={announcement.title} />
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
