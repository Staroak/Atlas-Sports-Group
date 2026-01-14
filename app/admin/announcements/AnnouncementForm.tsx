'use client'

import { useActionState, useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Switch } from '@/app/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { createAnnouncement, updateAnnouncement, type AnnouncementFormState } from '@/app/lib/actions/announcements'
import type { Announcement, Program } from '@/app/lib/types/database'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface AnnouncementFormProps {
  announcement?: Announcement
  programs: Program[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function AnnouncementForm({ announcement, programs }: AnnouncementFormProps) {
  const isEditing = !!announcement

  const [title, setTitle] = useState(announcement?.title || '')
  const [slug, setSlug] = useState(announcement?.slug || '')
  const [content, setContent] = useState(announcement?.content || '')
  const [excerpt, setExcerpt] = useState(announcement?.excerpt || '')
  const [imageUrl, setImageUrl] = useState(announcement?.image_url || '')
  const [programId, setProgramId] = useState(announcement?.program_id || '')
  const [isPublished, setIsPublished] = useState(announcement?.is_published || false)
  const [isPinned, setIsPinned] = useState(announcement?.is_pinned || false)
  const [publishAt, setPublishAt] = useState(
    announcement?.publish_at
      ? new Date(announcement.publish_at).toISOString().slice(0, 16)
      : ''
  )
  const [expiresAt, setExpiresAt] = useState(
    announcement?.expires_at
      ? new Date(announcement.expires_at).toISOString().slice(0, 16)
      : ''
  )

  const initialState: AnnouncementFormState = {}

  const boundAction = isEditing
    ? updateAnnouncement.bind(null, announcement.id)
    : createAnnouncement

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  useEffect(() => {
    if (!isEditing && title) {
      setSlug(generateSlug(title))
    }
  }, [title, isEditing])

  return (
    <form action={formAction}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/announcements">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="is_pinned"
              checked={isPinned}
              onCheckedChange={setIsPinned}
            />
            <Label htmlFor="is_pinned">Pinned</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="is_published">Published</Label>
          </div>
          <Button type="submit" disabled={isPending}>
            <Save className="h-4 w-4 mr-2" />
            {isPending ? 'Saving...' : 'Save Announcement'}
          </Button>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {state.error}
        </div>
      )}

      <input type="hidden" name="is_published" value={String(isPublished)} />
      <input type="hidden" name="is_pinned" value={String(isPinned)} />
      <input type="hidden" name="program_id" value={programId || ''} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Registration Now Open!"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g., registration-now-open"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (short preview)</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="A brief summary for the updates list..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Write your announcement content here..."
                  required
                />
                <p className="text-xs text-gray-500">
                  Supports basic text formatting
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program_id">Related Program (optional)</Label>
                <Select value={programId || 'none'} onValueChange={(val) => setProgramId(val === 'none' ? '' : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No program</SelectItem>
                    {programs.filter(p => p.id).map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/announcement.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publish_at">Publish At (optional)</Label>
                <Input
                  id="publish_at"
                  name="publish_at"
                  type="datetime-local"
                  value={publishAt}
                  onChange={(e) => setPublishAt(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to publish immediately when Published is on
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Expires At (optional)</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Automatically hide after this date
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
