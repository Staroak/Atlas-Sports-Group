'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/admin/programs': 'Programs',
  '/admin/programs/new': 'Create Program',
  '/admin/events': 'Events',
  '/admin/events/new': 'Create Event',
  '/admin/announcements': 'Announcements',
  '/admin/announcements/new': 'Create Announcement',
  '/admin/settings': 'Settings',
}

export function AdminHeader() {
  const pathname = usePathname()

  // Get title - check for exact match first, then check for edit pages
  let title = pageTitles[pathname]

  if (!title) {
    if (pathname.startsWith('/admin/programs/') && pathname !== '/admin/programs/new') {
      title = 'Edit Program'
    } else if (pathname.startsWith('/admin/events/') && pathname !== '/admin/events/new') {
      title = 'Edit Event'
    } else if (pathname.startsWith('/admin/announcements/') && pathname !== '/admin/announcements/new') {
      title = 'Edit Announcement'
    } else {
      title = 'Dashboard'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <h1 className="text-2xl font-bold text-atlas-navy">{title}</h1>
    </header>
  )
}
