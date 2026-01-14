'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { createClient } from '@/app/lib/supabase/client'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'

interface Program {
  id: string
  name: string
  registration_open: boolean
  registration_message: string | null
}

interface ContactInfo {
  email: string
  phone: string
  address: string
}

export default function SettingsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState<string>('')
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState('')

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: '',
  })

  const [loading, setLoading] = useState(true)
  const [regSaving, setRegSaving] = useState(false)
  const [contactSaving, setContactSaving] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [regError, setRegError] = useState('')
  const [contactError, setContactError] = useState('')

  // Load programs and contact info on mount
  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Load programs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: programsData } = await (supabase as any)
        .from('programs')
        .select('id, name, registration_open, registration_message')
        .eq('is_published', true)
        .order('display_order', { ascending: true })

      if (programsData) {
        const typedData = programsData as Program[]
        setPrograms(typedData)
        // Select first program by default
        if (typedData.length > 0) {
          setSelectedProgramId(typedData[0].id)
          setRegistrationOpen(typedData[0].registration_open || false)
          setRegistrationMessage(typedData[0].registration_message || '')
        }
      }

      // Load contact info
      type SettingRow = { value: Record<string, unknown> }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: contactData } = await (supabase as any)
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single() as { data: SettingRow | null }

      if (contactData) {
        const value = contactData.value as { email: string; phone: string; address: string }
        setContactInfo({
          email: value.email || '',
          phone: value.phone || '',
          address: value.address || '',
        })
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Update form when program selection changes
  const handleProgramChange = (programId: string) => {
    setSelectedProgramId(programId)
    const program = programs.find(p => p.id === programId)
    if (program) {
      setRegistrationOpen(program.registration_open || false)
      setRegistrationMessage(program.registration_message || '')
    }
    setRegSuccess(false)
    setRegError('')
  }

  // Save registration settings for selected program
  const handleSaveRegistration = async () => {
    if (!selectedProgramId) return

    setRegSaving(true)
    setRegSuccess(false)
    setRegError('')

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('programs')
      .update({
        registration_open: registrationOpen,
        registration_message: registrationMessage || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedProgramId)

    if (error) {
      setRegError('Could not save registration settings. Please try again.')
      console.error('Registration save error:', error)
    } else {
      setRegSuccess(true)
      // Update local state
      setPrograms(prev => prev.map(p =>
        p.id === selectedProgramId
          ? { ...p, registration_open: registrationOpen, registration_message: registrationMessage }
          : p
      ))
    }

    setRegSaving(false)
  }

  // Save contact info
  const handleSaveContact = async () => {
    setContactSaving(true)
    setContactSuccess(false)
    setContactError('')

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert({
        key: 'contact_info',
        value: {
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: contactInfo.address,
        },
        updated_at: new Date().toISOString(),
      })

    if (error) {
      setContactError('Could not save contact settings. Please try again.')
      console.error('Contact save error:', error)
    } else {
      setContactSuccess(true)
    }

    setContactSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Program Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Program Registration</CardTitle>
          <CardDescription>
            Control registration status for each program. Select a program and toggle registration on or off.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {programs.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
              No published programs found. Create and publish a program first.
            </div>
          ) : (
            <>
              {/* Program Selector */}
              <div className="space-y-2">
                <Label htmlFor="program">Select Program</Label>
                <Select value={selectedProgramId} onValueChange={handleProgramChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                        {program.registration_open && (
                          <span className="ml-2 text-green-600">(Open)</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Registration Toggle */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Switch
                  id="registration_open"
                  checked={registrationOpen}
                  onCheckedChange={setRegistrationOpen}
                />
                <Label htmlFor="registration_open" className="font-medium">
                  Registration is {registrationOpen ? (
                    <span className="text-green-600">Open</span>
                  ) : (
                    <span className="text-red-600">Closed</span>
                  )}
                </Label>
              </div>

              {/* Message when closed */}
              <div className="space-y-2">
                <Label htmlFor="registration_message">Message (shown when registration is closed)</Label>
                <Input
                  id="registration_message"
                  value={registrationMessage}
                  onChange={(e) => setRegistrationMessage(e.target.value)}
                  placeholder="e.g., Registration opens January 2026"
                />
                <p className="text-xs text-gray-500">
                  This message appears on the registration page when this program&apos;s registration is closed
                </p>
              </div>

              {/* Feedback */}
              {regError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Registration settings saved
                </div>
              )}

              <Button onClick={handleSaveRegistration} disabled={regSaving || !selectedProgramId}>
                <Save className="h-4 w-4 mr-2" />
                {regSaving ? 'Saving...' : 'Save Registration Settings'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update the contact details displayed on the site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              placeholder="info@atlassportsgroup.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="Phone">Phone</Label>
            <Input
              id="phone"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              placeholder="e.g., (604) 555-1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              placeholder="e.g., 123 Main Street, Port Moody, BC V3H 1A1"
            />
          </div>

          {contactError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {contactError}
            </div>
          )}

          {contactSuccess && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Contact settings saved
            </div>
          )}

          <Button onClick={handleSaveContact} disabled={contactSaving}>
            <Save className="h-4 w-4 mr-2" />
            {contactSaving ? 'Saving...' : 'Save Contact Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
