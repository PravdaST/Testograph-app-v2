'use client'

/**
 * Progress Photo Gallery Component
 * Visual progress tracking with before/after comparison
 */

import { useState, useEffect, useRef } from 'react'
import { Camera, X, Upload, Calendar, Scale, Percent, Trash2, Loader2, Image as ImageIcon, ArrowLeftRight } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/contexts/ToastContext'

interface ProgressPhoto {
  id: string
  email: string
  photo_url: string
  date: string
  weight?: number
  body_fat_pct?: number
  notes?: string
  created_at: string
}

interface ProgressPhotoGalleryProps {
  email: string
}

export function ProgressPhotoGallery({ email }: ProgressPhotoGalleryProps) {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0])
  const [uploadWeight, setUploadWeight] = useState('')
  const [uploadBodyFat, setUploadBodyFat] = useState('')
  const [uploadNotes, setUploadNotes] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [comparePhotos, setComparePhotos] = useState<ProgressPhoto[]>([])

  useEffect(() => {
    loadPhotos()
  }, [email])

  const loadPhotos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/progress-photos')
      const data = await response.json()

      if (response.ok && data.success) {
        setPhotos(data.photos)
      } else {
        console.error('Error loading photos:', data.error)
      }
    } catch (error) {
      console.error('Error fetching progress photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Невалиден формат. Позволени: JPEG, PNG, WebP')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Снимката е твърде голяма. Максимум 10MB')
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Моля изберете снимка')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('date', uploadDate)
      if (uploadWeight) formData.append('weight', uploadWeight)
      if (uploadBodyFat) formData.append('body_fat_pct', uploadBodyFat)
      if (uploadNotes) formData.append('notes', uploadNotes)

      const response = await fetch('/api/user/progress-photos', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Снимката е качена успешно!')
        setShowUploadModal(false)
        resetUploadForm()
        await loadPhotos() // Reload photos
      } else {
        toast.error(data.error || 'Грешка при качване на снимката')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Грешка при качване на снимката')
    } finally {
      setIsUploading(false)
    }
  }

  const resetUploadForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadDate(new Date().toISOString().split('T')[0])
    setUploadWeight('')
    setUploadBodyFat('')
    setUploadNotes('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    setDeletingPhotoId(photoId)

    try {
      const response = await fetch(`/api/user/progress-photos?id=${photoId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Снимката е изтрита')
        setPhotos(photos.filter((p) => p.id !== photoId))
        setShowDeleteModal(false)
        setSelectedPhoto(null)
      } else {
        toast.error(data.error || 'Грешка при изтриване')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast.error('Грешка при изтриване на снимката')
    } finally {
      setDeletingPhotoId(null)
    }
  }

  const toggleComparePhoto = (photo: ProgressPhoto) => {
    if (comparePhotos.find((p) => p.id === photo.id)) {
      setComparePhotos(comparePhotos.filter((p) => p.id !== photo.id))
    } else if (comparePhotos.length < 2) {
      setComparePhotos([...comparePhotos, photo])
    } else {
      toast.error('Можете да сравните само 2 снимки')
    }
  }

  if (loading) {
    return (
      <div className="bg-background rounded-2xl p-5 border border-border">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background rounded-2xl p-5 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h2 className="font-bold">Progress Photos</h2>
          <span className="text-xs text-muted-foreground">({photos.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {photos.length >= 2 && (
            <button
              onClick={() => {
                setCompareMode(!compareMode)
                setComparePhotos([])
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                compareMode
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="text-sm">Сравни</span>
            </button>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Качи снимка</span>
          </button>
        </div>
      </div>

      {/* Compare View */}
      {compareMode && comparePhotos.length === 2 && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            {comparePhotos.map((photo, index) => {
              const dateDiff = index === 1 && comparePhotos[0]
                ? Math.abs(new Date(photo.date).getTime() - new Date(comparePhotos[0].date).getTime()) / (1000 * 60 * 60 * 24)
                : 0
              const weightDiff = index === 1 && comparePhotos[0]?.weight && photo.weight
                ? (photo.weight - comparePhotos[0].weight).toFixed(1)
                : null

              return (
                <div key={photo.id} className="space-y-2">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src={photo.photo_url}
                      alt={`Progress ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">
                      {new Date(photo.date).toLocaleDateString('bg-BG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    {photo.weight && (
                      <div className="text-muted-foreground">{photo.weight} kg</div>
                    )}
                    {index === 1 && dateDiff > 0 && (
                      <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                        <div>📅 {Math.floor(dateDiff)} дни разлика</div>
                        {weightDiff && (
                          <div className={parseFloat(weightDiff) < 0 ? 'text-green-600' : 'text-amber-600'}>
                            ⚖️ {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} kg
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => {
              setCompareMode(false)
              setComparePhotos([])
            }}
            className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Затвори сравнението
          </button>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="py-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Все още нямате качени progress снимки
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Качете първата си снимка
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`relative group ${
                compareMode
                  ? comparePhotos.find((p) => p.id === photo.id)
                    ? 'ring-2 ring-primary'
                    : 'cursor-pointer'
                  : 'cursor-pointer'
              }`}
              onClick={() => {
                if (compareMode) {
                  toggleComparePhoto(photo)
                } else {
                  setSelectedPhoto(photo)
                }
              }}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={photo.photo_url}
                  alt={`Progress ${photo.date}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
                <div className="font-medium">
                  {new Date(photo.date).toLocaleDateString('bg-BG', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
                {photo.weight && <div>{photo.weight} kg</div>}
              </div>
              {compareMode && comparePhotos.find((p) => p.id === photo.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {comparePhotos.findIndex((p) => p.id === photo.id) + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Качи Progress Снимка</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  resetUploadForm()
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {previewUrl ? (
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Кликнете за избор на снимка
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG, WebP (макс. 10MB)
                      </p>
                    </div>
                  )}
                </button>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Дата на снимката
                </label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Weight (Optional) */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Тегло (кг) - опционално
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={uploadWeight}
                  onChange={(e) => setUploadWeight(e.target.value)}
                  placeholder="Напр. 75.5"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Body Fat % (Optional) */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Мазнини (%) - опционално
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={uploadBodyFat}
                  onChange={(e) => setUploadBodyFat(e.target.value)}
                  placeholder="Напр. 15.5"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Бележки - опционално
                </label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Напр. След 2 седмици интензивни тренировки..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    resetUploadForm()
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={isUploading}
                >
                  Отказ
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Качва се...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Качи снимката
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Detail Modal (Lightbox) */}
      {selectedPhoto && !compareMode && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-background/20 hover:bg-background/30 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-2xl w-full">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedPhoto.photo_url}
                alt={`Progress ${selectedPhoto.date}`}
                fill
                className="object-contain"
              />
            </div>

            <div className="bg-background/90 backdrop-blur rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">
                    {new Date(selectedPhoto.date).toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  {selectedPhoto.weight && (
                    <div className="text-sm text-muted-foreground">
                      Тегло: {selectedPhoto.weight} kg
                    </div>
                  )}
                  {selectedPhoto.body_fat_pct && (
                    <div className="text-sm text-muted-foreground">
                      Мазнини: {selectedPhoto.body_fat_pct}%
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(true)
                  }}
                  className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {selectedPhoto.notes && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">Бележки:</div>
                  <p className="text-sm">{selectedPhoto.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Изтрий снимката?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Това действие е необратимо. Снимката ще бъде изтрита завинаги.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                disabled={deletingPhotoId === selectedPhoto.id}
              >
                Отказ
              </button>
              <button
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                disabled={deletingPhotoId === selectedPhoto.id}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingPhotoId === selectedPhoto.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Изтрива се...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Изтрий
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
