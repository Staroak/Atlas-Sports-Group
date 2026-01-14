import Image from 'next/image'
import Link from 'next/link'
import Container from '../components/layout/Container'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import EventsCalendar from '@/app/components/EventsCalendar'
import { getPublishedPrograms } from '@/app/lib/queries/programs'
import { getPublishedEvents } from '@/app/lib/queries/events'

export default async function ProgramsPage() {
  const [programs, events] = await Promise.all([
    getPublishedPrograms(),
    getPublishedEvents(),
  ])

  return (
    <div>
      {/* Page Header with more color */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#B8D8FF] via-[#CCF2FF] to-[#78FFD0] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"></div>

        <Container>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-atlas-navy mb-4 font-heading">
              Our Programs
            </h1>
            <p className="text-lg md:text-xl text-neutral-700">
              Find the perfect fit for your family. From youth leagues to adult
              recreation, we offer programs for every age and skill level.
            </p>
          </div>
        </Container>
      </section>

      {/* Programs Grid with colorful accents */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, #2563eb 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Programs - takes 3 columns on large screens */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-neutral-600">
                    No programs available at this time. Check back soon!
                  </p>
                </div>
              ) : (
                programs.map((program) => (
                  <Card
                    key={program.id}
                    className="h-full flex flex-col transition-all duration-300 hover:shadow-xl overflow-hidden"
                  >
                    {/* Larger Image with colored overlay on hover */}
                    {program.logo && (
                      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
                        <Image
                          src={program.logo}
                          alt={program.name}
                          fill
                          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl text-atlas-navy">
                        {program.name}
                      </CardTitle>
                      {program.tagline && (
                        <CardDescription className="text-sm line-clamp-2">
                          {program.tagline}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {program.youthAges && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 border-blue-200"
                          >
                            {program.youthAges}
                          </Badge>
                        )}
                        {program.adultAges && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 border-green-200"
                          >
                            {program.adultAges}
                          </Badge>
                        )}
                      </div>
                      {/* Schedule info */}
                      {program.schedule && (
                        <p className="text-xs text-neutral-500 mt-2">
                          {program.schedule}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg w-full sm:w-auto cursor-pointer"
                      >
                        Learn More
                      </Link>
                      <Link
                        href={`/registration#${program.slug}`}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all h-9 px-4 py-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-xl w-full sm:w-auto cursor-pointer"
                      >
                        Register
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            {/* Calendar Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <EventsCalendar events={events} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA Section with color */}
      <section className="py-16 bg-gradient-to-b from-white via-blue-400 to-atlas-navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-atlas-navy mb-4 font-heading">
              Ready to Join?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Registration opens late January 2026. Sign up for updates to be
              the first to know!
            </p>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="bg-white text-blue-600 hover:bg-white/90 border-white"
            >
              <Link href="/registration">Get Notified</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
