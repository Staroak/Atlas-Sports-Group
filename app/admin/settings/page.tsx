'use client'

import { useActionState, useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Switch } from '@/app/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { updateRegistrationStatus, updateContactInfo, type SettingsFormState } from '@/app/lib/actions/settings'
import { createClient } from '@/app/lib/supabase/client'
import { Save, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [registrationStatus, setRegistrationStatus] = useState({
    isOpen: false,
    openDate: '',
    message: '',
  })
  const [contactInfo, setContactInfo] = useState({
    email: '',
    serviceArea: '',
  })
  const [loading, setLoading] = useState(true)

  const initialState: SettingsFormState = {}

  const [regState, regAction, regPending] = useActionState(updateRegistrationStatus, initialState)
  const [contactState, contactAction, contactPending] = useActionState(updateContactInfo, initialState)

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient()

      type SettingRow = { value: Record<string, unknown> }

      const { data: regData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'registration_status')
        .single() as { data: SettingRow | null }

      if (regData) {
        const value = regData.value as { isOpen: boolean; openDate: string; message: string }
        setRegistrationStatus({
          isOpen: value.isOpen || false,
          openDate: value.openDate || '',
          message: value.message || '',
        })
      }

      const { data: contactData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single() as { data: SettingRow | null }

      if (contactData) {
        const value = contactData.value as { email: string; serviceArea: string }
        setContactInfo({
          email: value.email || '',
          serviceArea: value.serviceArea || '',
        })
      }

      setLoading(false)
    }

    loadSettings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Registration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Status</CardTitle>
          <CardDescription>
            Control whether registration is open and customize the message shown to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={regAction} className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch
                id="is_open"
                checked={registrationStatus.isOpen}
                onCheckedChange={(checked) =>
                  setRegistrationStatus({ ...registrationStatus, isOpen: checked })
                }
              />
              <Label htmlFor="is_open" className="font-medium">
                Registration is {registrationStatus.isOpen ? 'Open' : 'Closed'}
              </Label>
            </div>
            <input type="hidden" name="is_open" value={String(registrationStatus.isOpen)} />

            <div className="space-y-2">
              <Label htmlFor="open_date">Expected Open Date</Label>
              <Input
                id="open_date"
                name="open_date"
                value={registrationStatus.openDate}
                onChange={(e) =>
                  setRegistrationStatus({ ...registrationStatus, openDate: e.target.value })
                }
                placeholder="e.g., Late January 2026"
              />
              <p className="text-xs text-gray-500">
                Shown when registration is closed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Status Message</Label>
              <Textarea
                id="message"
                name="message"
                value={registrationStatus.message}
                onChange={(e) =>
                  setRegistrationStatus({ ...registrationStatus, message: e.target.value })
                }
                rows={2}
                placeholder="e.g., Registration will open late January 2026. Check back soon!"
              />
            </div>

            {regState.error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {regState.error}
              </div>
            )}

            {regState.success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Settings saved successfully
              </div>
            )}

            <Button type="submit" disabled={regPending}>
              <Save className="h-4 w-4 mr-2" />
              {regPending ? 'Saving...' : 'Save Registration Settings'}
            </Button>
          </form>
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
        <CardContent>
          <form action={contactAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                placeholder="info@atlassportsgroup.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_area">Service Area</Label>
              <Input
                id="service_area"
                name="service_area"
                value={contactInfo.serviceArea}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, serviceArea: e.target.value })
                }
                placeholder="e.g., Serving the Tri-Cities: Port Moody, Coquitlam, Port Coquitlam"
              />
            </div>

            {contactState.error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {contactState.error}
              </div>
            )}

            {contactState.success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Settings saved successfully
              </div>
            )}

            <Button type="submit" disabled={contactPending}>
              <Save className="h-4 w-4 mr-2" />
              {contactPending ? 'Saving...' : 'Save Contact Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
