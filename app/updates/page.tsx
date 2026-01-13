import { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedAnnouncements } from '@/app/lib/queries/announcements'
import Container from '@/app/components/layout/Container'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Pin, ArrowLeft, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'Updates | Atlas Sports Group',
  description: 'Latest news and announcements from Atlas Sports Group.',
}

export default async function UpdatesPage() {
  const announcements = await getPublishedAnnouncements()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-atlas-navy to-atlas-blue py-16">
        <Container>
          <Link href="/">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Updates</h1>
          <p className="text-lg text-white/80">
            Latest news and announcements from Atlas Sports Group
          </p>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-12">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No updates at this time. Check back soon!</p>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {announcement.is_pinned && (
                        <Pin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <CardTitle className="text-xl">
                          {announcement.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(announcement.created_at), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    {announcement.is_pinned && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Pinned
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {announcement.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="prose prose-gray max-w-none">
                    {announcement.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
