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
import { createEvent, updateEvent, type EventFormState } from '@/app/lib/actions/events'
import type { Event, Program } from '@/app/lib/types/database'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface EventFormProps {
  event?: Event
  programs: Program[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function EventForm({ event, programs }: EventFormProps) {
  const isEditing = !!event

  const [title, setTitle] = useState(event?.title || '')
  const [slug, setSlug] = useState(event?.slug || '')
  const [description, setDescription] = useState(event?.description || '')
  const [programId, setProgramId] = useState(event?.program_id || '')
  const [startDate, setStartDate] = useState(event?.start_date || '')
  const [endDate, setEndDate] = useState(event?.end_date || '')
  const [startTime, setStartTime] = useState(event?.start_time || '')
  const [endTime, setEndTime] = useState(event?.end_time || '')
  const [isAllDay, setIsAllDay] = useState(event?.is_all_day || false)
  const [location, setLocation] = useState(event?.location || '')
  const [isPublished, setIsPublished] = useState(event?.is_published || false)
  const [isFeatured, setIsFeatured] = useState(event?.is_featured || false)

  const initialState: EventFormState = {}

  const boundAction = isEditing
    ? updateEvent.bind(null, event.id)
    : createEvent

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  useEffect(() => {
    if (!isEditing && title) {
      setSlug(generateSlug(title))
    }
  }, [title, isEditing])

  return (
    <form action={formAction}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/events">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="is_featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
            <Label htmlFor="is_featured">Featured</Label>
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
            {isPending ? 'Saving...' : 'Save Event'}
          </Button>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {state.error}
        </div>
      )}

      <input type="hidden" name="is_published" value={String(isPublished)} />
      <input type="hidden" name="is_featured" value={String(isFeatured)} />
      <input type="hidden" name="is_all_day" value={String(isAllDay)} />
      <input type="hidden" name="program_id" value={programId || ''} />

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Spring Registration Opens"
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
                placeholder="e.g., spring-registration-opens"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the event..."
              />
            </div>

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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Rocky Point Park, Port Moody"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Switch
                id="is_all_day_toggle"
                checked={isAllDay}
                onCheckedChange={setIsAllDay}
              />
              <Label htmlFor="is_all_day_toggle">All day event</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
