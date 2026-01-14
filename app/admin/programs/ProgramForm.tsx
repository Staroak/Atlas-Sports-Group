'use client'

import { useActionState, useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Switch } from '@/app/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { ArrayFieldEditor } from '../components/ArrayFieldEditor'
import { ImageUpload } from '../components/ImageUpload'
import { createProgram, updateProgram, type ProgramFormState } from '@/app/lib/actions/programs'
import type { Program } from '@/app/lib/types/database'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ProgramFormProps {
  program?: Program
}

interface FieldErrors {
  name?: string
  slug?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ProgramForm({ program }: ProgramFormProps) {
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
  const [features, setFeatures] = useState<string[]>(Array.isArray(program?.features) ? program.features.filter(Boolean) : [])
  const [benefits, setBenefits] = useState<string[]>(Array.isArray(program?.benefits) ? program.benefits.filter(Boolean) : [])
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(Array.isArray(program?.what_youll_learn) ? program.what_youll_learn.filter(Boolean) : [])
  const [whatToBring, setWhatToBring] = useState<string[]>(Array.isArray(program?.what_to_bring) ? program.what_to_bring.filter(Boolean) : [])

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showAllErrors, setShowAllErrors] = useState(false)

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

  // Validate fields
  const validateField = (fieldName: string, value: string) => {
    const errors: FieldErrors = { ...fieldErrors }

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Program name is required'
        } else {
          delete errors.name
        }
        break
      case 'slug':
        if (!value.trim()) {
          errors.slug = 'URL slug is required'
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
        } else {
          delete errors.slug
        }
        break
    }

    setFieldErrors(errors)
    return errors
  }

  // Handle blur to mark field as touched
  const handleBlur = (fieldName: string, value: string) => {
    setTouched({ ...touched, [fieldName]: true })
    validateField(fieldName, value)
  }

  // Check if form is valid
  const isFormValid = () => {
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = 'Program name is required'
    if (!slug.trim()) errors.slug = 'URL slug is required'
    return Object.keys(errors).length === 0
  }

  // Handle form submission with validation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Validate all required fields
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = 'Program name is required'
    if (!slug.trim()) errors.slug = 'URL slug is required'
    else if (!/^[a-z0-9-]+$/.test(slug)) errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'

    if (Object.keys(errors).length > 0) {
      e.preventDefault()
      setFieldErrors(errors)
      setShowAllErrors(true)
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
  }

  // Get error for a field (only show if touched or showAllErrors)
  const getFieldError = (fieldName: keyof FieldErrors) => {
    if (showAllErrors || touched[fieldName]) {
      return fieldErrors[fieldName]
    }
    return undefined
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
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

      {/* Validation Error Summary */}
      {showAllErrors && Object.keys(fieldErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Please fix the following issues:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                {fieldErrors.name && <li>{fieldErrors.name}</li>}
                {fieldErrors.slug && <li>{fieldErrors.slug}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Server Error */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        </div>
      )}

      {/* Hidden inputs to ensure all fields are submitted regardless of active tab */}
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="tagline" value={tagline} />
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="logo_url" value={logoUrl} />
      <input type="hidden" name="youth_ages" value={youthAges} />
      <input type="hidden" name="adult_ages" value={adultAges} />
      <input type="hidden" name="schedule" value={schedule} />
      <input type="hidden" name="display_order" value={String(displayOrder)} />
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
                  <Label htmlFor="name" className={getFieldError('name') ? 'text-red-600' : ''}>
                    Program Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (touched.name) validateField('name', e.target.value)
                    }}
                    onBlur={(e) => handleBlur('name', e.target.value)}
                    placeholder="e.g., Skyhawks Flag Football"
                    className={getFieldError('name') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {getFieldError('name') && (
                    <p className="text-sm text-red-600">{getFieldError('name')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className={getFieldError('slug') ? 'text-red-600' : ''}>
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      if (touched.slug) validateField('slug', e.target.value)
                    }}
                    onBlur={(e) => handleBlur('slug', e.target.value)}
                    placeholder="e.g., skyhawks-flag-football"
                    className={getFieldError('slug') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {getFieldError('slug') ? (
                    <p className="text-sm text-red-600">{getFieldError('slug')}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Will be used in URL: /programs/{slug || 'your-slug'}
                    </p>
                  )}
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

              <ImageUpload
                id="logo_url"
                name="logo_url"
                label="Logo"
                value={logoUrl}
                onChange={setLogoUrl}
                helpText="Upload an image or paste a URL"
              />

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
