import Link from 'next/link'
import { getAllEvents } from '@/app/lib/queries/events'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Plus, Pencil } from 'lucide-react'
import { DeleteEventButton } from './DeleteEventButton'
import { format } from 'date-fns'

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage calendar events. {events.length} event{events.length !== 1 ? 's' : ''} total.
        </p>
        <Link href="/admin/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No events yet. Create your first event to get started.</p>
          <Link href="/admin/events/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Event</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Program</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{event.title}</div>
                      {event.location && (
                        <div className="text-sm text-gray-500">{event.location}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {format(new Date(event.start_date), 'MMM d, yyyy')}
                      {event.end_date && event.end_date !== event.start_date && (
                        <span> - {format(new Date(event.end_date), 'MMM d, yyyy')}</span>
                      )}
                      {!event.is_all_day && event.start_time && (
                        <div className="text-gray-400">
                          {event.start_time}
                          {event.end_time && ` - ${event.end_time}`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {(event as { programs?: { name: string } }).programs?.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Badge variant={event.is_published ? 'default' : 'secondary'}>
                        {event.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {event.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteEventButton id={event.id} title={event.title} />
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
