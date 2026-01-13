'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Switch } from '@/app/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { ArrayFieldEditor } from '../components/ArrayFieldEditor'
import { createProgram, updateProgram, type ProgramFormState } from '@/app/lib/actions/programs'
import type { Program } from '@/app/lib/types/database'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface ProgramFormProps {
  program?: Program
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter()
  const isEditing = !!program

  const [name, setName] = useState(program?.name || '')
  const [slug, setSlug] = useState(program?.slug || '')
  const [tagline, setTagline] = useState(program?.tagline || '')
  const [description, setDescription] = useState(program?.description || '')
  const [logoUrl, setLogoUrl] = useState(program?.logo_url || '')
  const [youthAges, setYouthAges] = useState(program?.youth_ages || '')
  const [adultAges, setAdultAges] = useState(program?.adult_ages || '')
  const [schedule, setSchedule] = useState(program?.schedule || '')
  const [displayOrder, setDisplayOrder] = useState(program?.display_order || 0)
  const [isPublished, setIsPublished] = useState(program?.is_published || false)
  const [features, setFeatures] = useState<string[]>(program?.features || [])
  const [benefits, setBenefits] = useState<string[]>(program?.benefits || [])
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(program?.what_youll_learn || [])
  const [whatToBring, setWhatToBring] = useState<string[]>(program?.what_to_bring || [])

  const initialState: ProgramFormState = {}

  const boundAction = isEditing
    ? updateProgram.bind(null, program.id)
    : createProgram

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  // Auto-generate slug from name for new programs
  useEffect(() => {
    if (!isEditing && name) {
      setSlug(generateSlug(name))
    }
  }, [name, isEditing])

  return (
    <form action={formAction}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/programs">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
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
            {isPending ? 'Saving...' : 'Save Program'}
          </Button>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {state.error}
        </div>
      )}

      <input type="hidden" name="is_published" value={String(isPublished)} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="benefits" value={JSON.stringify(benefits)} />
      <input type="hidden" name="what_youll_learn" value={JSON.stringify(whatYoullLearn)} />
      <input type="hidden" name="what_to_bring" value={JSON.stringify(whatToBring)} />

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="ages">Ages & Schedule</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Skyhawks Flag Football"
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
                    placeholder="e.g., skyhawks-flag-football"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Will be used in URL: /programs/{slug || 'your-slug'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g., Fast-paced, non-contact fun for all ages"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the program..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/logos/program-logo.png"
                  />
                  <p className="text-xs text-gray-500">
                    Path to logo image in /public folder
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                    min={0}
                  />
                  <p className="text-xs text-gray-500">
                    Lower numbers appear first
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ages">
          <Card>
            <CardHeader>
              <CardTitle>Ages & Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="youth_ages">Youth Ages</Label>
                  <Input
                    id="youth_ages"
                    name="youth_ages"
                    value={youthAges}
                    onChange={(e) => setYouthAges(e.target.value)}
                    placeholder="e.g., Ages 5-18"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adult_ages">Adult Ages (optional)</Label>
                  <Input
                    id="adult_ages"
                    name="adult_ages"
                    value={adultAges}
                    onChange={(e) => setAdultAges(e.target.value)}
                    placeholder="e.g., Adult Co-Ed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Textarea
                  id="schedule"
                  name="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  rows={2}
                  placeholder="e.g., Weekly sessions, Spring (Apr-Jun), Summer (Jul-Aug), Fall (Sept-Dec)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrayFieldEditor
                  label=""
                  name="features_display"
                  values={features}
                  onChange={setFeatures}
                  placeholder="Add a feature..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrayFieldEditor
                  label=""
                  name="benefits_display"
                  values={benefits}
                  onChange={setBenefits}
                  placeholder="Add a benefit..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What You&apos;ll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrayFieldEditor
                  label=""
                  name="what_youll_learn_display"
                  values={whatYoullLearn}
                  onChange={setWhatYoullLearn}
                  placeholder="Add a learning outcome..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to Bring</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrayFieldEditor
                  label=""
                  name="what_to_bring_display"
                  values={whatToBring}
                  onChange={setWhatToBring}
                  placeholder="Add an item..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
