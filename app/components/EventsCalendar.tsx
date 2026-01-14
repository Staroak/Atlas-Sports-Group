'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calendar } from '@/app/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { format, isSameDay, isSameMonth, eachDayOfInterval, isWithinInterval, isBefore, startOfDay } from 'date-fns'
import { CalendarDays, MapPin, Clock, ExternalLink } from 'lucide-react'
import type { EventWithProgram } from '@/app/lib/queries/events'

interface EventsCalendarProps {
  events: EventWithProgram[]
}

// Check if a date falls within an event's date range
function isDateInEventRange(date: Date, event: EventWithProgram): boolean {
  const start = new Date(event.start_date)
  const end = event.end_date ? new Date(event.end_date) : start
  // Set times to midnight for accurate date comparison
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  const checkDate = new Date(date)
  checkDate.setHours(12, 0, 0, 0)
  return isWithinInterval(checkDate, { start, end })
}

// Get all dates for an event (for calendar highlighting)
function getEventDateRange(event: EventWithProgram): Date[] {
  const start = new Date(event.start_date)
  const end = event.end_date ? new Date(event.end_date) : start
  return eachDayOfInterval({ start, end })
}

export default function EventsCalendar({ events }: EventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Get events for the selected date (checks full date range)
  const selectedDateEvents = selectedDate
    ? events.filter((event) => isDateInEventRange(selectedDate, event))
    : []

  // Get all dates that have events for highlighting (includes full range)
  const today = startOfDay(new Date())
  const eventDates = events.flatMap((event) => getEventDateRange(event))

  // Separate past event dates from current/future event dates
  const pastEventDates = eventDates.filter((date) => isBefore(date, today))
  const currentEventDates = eventDates.filter((date) => !isBefore(date, today))

  // Get events for current month view (includes events that overlap with month)
  const monthEvents = events.filter((event) => {
    const start = new Date(event.start_date)
    const end = event.end_date ? new Date(event.end_date) : start
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    return (
      isSameMonth(start, currentMonth) ||
      isSameMonth(end, currentMonth) ||
      (start < monthStart && end > monthEnd)
    )
  })

  const formatEventTime = (event: EventWithProgram) => {
    if (event.is_all_day) return 'All Day'
    if (event.start_time) {
      const [hours, minutes] = event.start_time.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      return format(date, 'h:mm a')
    }
    return ''
  }

  return (
    <Card className="overflow-hidden w-full min-w-[400px]">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 p-6">
        <CardTitle className="text-2xl text-atlas-navy flex items-center gap-2">
          <CalendarDays className="w-6 h-6" />
          Upcoming Events
        </CardTitle>
        <CardDescription className="text-base">
          View scheduled events and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border w-full"
          modifiers={{
            hasEvent: currentEventDates,
            pastEvent: pastEventDates,
          }}
          modifiersClassNames={{
            hasEvent: 'bg-blue-100 text-blue-700 font-semibold',
            pastEvent: 'bg-gray-100 text-gray-400',
          }}
        />

        {/* Selected Date Events */}
        <div className="mt-6">
          <h4 className="font-semibold text-atlas-navy text-sm mb-3">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </h4>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-medium text-atlas-navy text-sm">
                      {event.title}
                    </h5>
                    {event.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Show date range for multi-day events */}
                  {event.end_date && event.end_date !== event.start_date && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600">
                      <CalendarDays className="w-3 h-3" />
                      {format(new Date(event.start_date), 'MMM d')} - {format(new Date(event.end_date), 'MMM d')}
                    </div>
                  )}

                  {event.start_time && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600">
                      <Clock className="w-3 h-3" />
                      {formatEventTime(event)}
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  )}

                  {event.description && (
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* Link to program if event has one */}
                  {event.programs?.slug && (
                    <Link
                      href={`/programs/${event.programs.slug}`}
                      className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View {event.programs.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              {selectedDate ? 'No events on this date' : 'Click a date to see events'}
            </p>
          )}
        </div>

        {/* Upcoming Events List */}
        {monthEvents.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-atlas-navy text-sm mb-3">
              This Month ({monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''})
            </h4>
            <div className="space-y-2">
              {monthEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-neutral-50 p-2 rounded-md transition-colors"
                  onClick={() => setSelectedDate(new Date(event.start_date))}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-700 font-semibold text-xs">
                    {format(new Date(event.start_date), 'd')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-atlas-navy truncate">{event.title}</p>
                    <p className="text-xs text-neutral-500">{formatEventTime(event)}</p>
                  </div>
                </div>
              ))}
              {monthEvents.length > 5 && (
                <p className="text-xs text-neutral-500 text-center pt-2">
                  +{monthEvents.length - 5} more events
                </p>
              )}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg text-center">
            <p className="text-sm font-medium text-atlas-navy mb-1">No Events Scheduled</p>
            <p className="text-xs text-neutral-600">Check back soon for upcoming events!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
