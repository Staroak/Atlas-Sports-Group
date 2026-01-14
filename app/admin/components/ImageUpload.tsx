'use client'

import { useState, useRef, useCallback } from 'react'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Button } from '@/app/components/ui/button'
import { createClient } from '@/app/lib/supabase/client'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  helpText?: string
}

export function ImageUpload({
  id,
  name,
  label,
  value,
  onChange,
  bucket = 'logos',
  folder = 'programs',
  helpText,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      setIsUploading(false)
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB')
      setIsUploading(false)
      return
    }

    try {
      const supabase = createClient()

      // Generate unique filename
      const ext = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      onChange(urlData.publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }, [bucket, folder, onChange])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleClear = useCallback(() => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            title="Clear"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : value ? (
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
              <p className="text-xs text-gray-500">Click or drop to replace</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="rounded-full bg-gray-100 p-3">
              {isDragging ? (
                <Upload className="h-6 w-6 text-blue-500" />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop an image here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 2MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  )
}
