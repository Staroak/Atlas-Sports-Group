import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'

export interface ProgramCardProps {
  name: string
  slug: string
  tagline?: string
  logo?: string
  youthAges?: string
  adultAges?: string
  schedule?: string
  /** Hide action buttons (used in preview contexts) */
  hideActions?: boolean
}

export function ProgramCard({
  name,
  slug,
  tagline,
  logo,
  youthAges,
  adultAges,
  schedule,
  hideActions = false,
}: ProgramCardProps) {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl overflow-hidden">
      {/* Larger Image with colored overlay on hover */}
      {logo && (
        <div className="relative h-56 md:h-64 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
          <Image
            src={logo}
            alt={name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-atlas-navy">
          {name || 'Untitled Program'}
        </CardTitle>
        {tagline && (
          <CardDescription className="text-sm line-clamp-2">
            {tagline}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {youthAges && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 border-blue-200"
            >
              {youthAges}
            </Badge>
          )}
          {adultAges && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              {adultAges}
            </Badge>
          )}
        </div>
        {/* Schedule info */}
        {schedule && (
          <p className="text-xs text-neutral-500 mt-2">
            {schedule}
          </p>
        )}
      </CardContent>
      {!hideActions && (
        <CardFooter className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Link
            href={`/programs/${slug}`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg w-full sm:w-auto cursor-pointer"
          >
            Learn More
          </Link>
          <Link
            href={`/registration#${slug}`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all h-9 px-4 py-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-xl w-full sm:w-auto cursor-pointer"
          >
            Register
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
