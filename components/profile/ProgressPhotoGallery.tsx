'use client'

/**
 * Progress Photo Gallery Component
 * Visual progress tracking with before/after comparison
 * Supports both file upload and direct camera capture
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, X, Upload, Calendar, Scale, Percent, Trash2, Loader2, Image as ImageIcon, ArrowLeftRight, Video, SwitchCamera, Circle, Download } from 'lucide-react'
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  // Camera states
  const [isCameraMode, setIsCameraMode] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  useEffect(() => {
    loadPhotos()
  }, [email])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  // Start camera when camera mode is activated
  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)
      setIsCameraActive(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Няма достъп до камерата. Моля, разрешете достъпа в настройките.')
      setIsCameraMode(false)
    }
  }, [facingMode, cameraStream, toast])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setIsCameraActive(false)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [cameraStream])

  // Switch between front and back camera
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)

    if (isCameraActive) {
      stopCamera()
      // Small delay to ensure camera is fully stopped
      setTimeout(() => {
        startCamera()
      }, 100)
    }
  }, [facingMode, isCameraActive, stopCamera, startCamera])

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create File from blob
          const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' })
          setSelectedFile(file)

          // Create preview URL
          const url = URL.createObjectURL(blob)
          setPreviewUrl(url)

          // Stop camera after capture
          stopCamera()
          setIsCameraMode(false)
        }
      },
      'image/jpeg',
      0.9
    )
  }, [stopCamera])

  // Start camera when entering camera mode
  useEffect(() => {
    if (isCameraMode && !isCameraActive && showUploadModal) {
      startCamera()
    }
  }, [isCameraMode, isCameraActive, showUploadModal, startCamera])

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
    setIsCameraMode(false)
    stopCamera()
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

  // Download photo with watermark
  const downloadWithWatermark = useCallback(async (photo: ProgressPhoto) => {
    try {
      toast.success('Подготвяне на снимката...')

      // Create canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Load the photo
      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = photo.photo_url
      })

      // Set canvas size to image size
      canvas.width = img.width
      canvas.height = img.height

      // Draw the photo
      ctx.drawImage(img, 0, 0)

      // Load watermark logo
      const logo = new window.Image()
      logo.crossOrigin = 'anonymous'

      await new Promise((resolve, reject) => {
        logo.onload = resolve
        logo.onerror = reject
        logo.src = '/testograph_white_logo.png'
      })

      // Calculate watermark size (15% of image width)
      const watermarkWidth = img.width * 0.15
      const watermarkHeight = (logo.height / logo.width) * watermarkWidth

      // Position: bottom right with padding
      const padding = img.width * 0.03
      const x = img.width - watermarkWidth - padding
      const y = img.height - watermarkHeight - padding - 30 // Extra space for text

      // Add semi-transparent background for watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      const bgPadding = 15
      ctx.fillRect(
        x - bgPadding,
        y - bgPadding,
        watermarkWidth + bgPadding * 2,
        watermarkHeight + 40 + bgPadding * 2
      )

      // Draw logo
      ctx.drawImage(logo, x, y, watermarkWidth, watermarkHeight)

      // Add text below logo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = `bold ${Math.max(14, img.width * 0.018)}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText('app.testograph.eu', x + watermarkWidth / 2, y + watermarkHeight + 25)

      // Add date watermark in top left
      const dateText = new Date(photo.date).toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(padding, padding, ctx.measureText(dateText).width + 30, 40)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = `bold ${Math.max(16, img.width * 0.02)}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText(dateText, padding + 15, padding + 28)

      // Convert to blob and download
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `testograph-progress-${photo.date}.jpg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success('Снимката е изтеглена!')
          }
        },
        'image/jpeg',
        0.95
      )
    } catch (error) {
      console.error('Error downloading photo:', error)
      toast.error('Грешка при изтегляне на снимката')
    }
  }, [toast])

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
            onClick={() => {
              setIsCameraMode(true)
              setShowUploadModal(true)
            }}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            title="Снимай с камера"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Качи</span>
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

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {isCameraMode ? 'Снимай' : 'Добави снимка'}
              </h2>
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
              {/* Mode Toggle - Only show if no preview yet */}
              {!previewUrl && !isCameraActive && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setIsCameraMode(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      !isCameraMode
                        ? 'bg-background shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Качи</span>
                  </button>
                  <button
                    onClick={() => setIsCameraMode(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      isCameraMode
                        ? 'bg-background shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Снимай</span>
                  </button>
                </div>
              )}

              {/* Camera View */}
              {isCameraMode && !previewUrl && (
                <div className="relative">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  {isCameraActive && (
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                      {/* Switch Camera */}
                      <button
                        onClick={switchCamera}
                        className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors"
                      >
                        <SwitchCamera className="w-6 h-6 text-white" />
                      </button>

                      {/* Capture Button */}
                      <button
                        onClick={capturePhoto}
                        className="p-4 bg-white rounded-full hover:bg-white/90 transition-colors shadow-lg"
                      >
                        <Circle className="w-8 h-8 text-primary fill-primary" />
                      </button>

                      {/* Cancel */}
                      <button
                        onClick={() => {
                          stopCamera()
                          setIsCameraMode(false)
                        }}
                        className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload (when not in camera mode and no preview) */}
              {!isCameraMode && !previewUrl && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Кликнете за избор на снимка
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG, WebP (макс. 10MB)
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Preview (from file upload or camera capture) */}
              {previewUrl && selectedFile && (
                <div className="space-y-2">
                  <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Избери друга снимка
                  </button>
                </div>
              )}

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

            <div className="bg-black/70 backdrop-blur rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-white">
                    {new Date(selectedPhoto.date).toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  {selectedPhoto.weight && (
                    <div className="text-sm text-white/70">
                      Тегло: {selectedPhoto.weight} kg
                    </div>
                  )}
                  {selectedPhoto.body_fat_pct && (
                    <div className="text-sm text-white/70">
                      Мазнини: {selectedPhoto.body_fat_pct}%
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadWithWatermark(selectedPhoto)}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    title="Изтегли снимката"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true)
                    }}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    title="Изтрий снимката"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedPhoto.notes && (
                <div className="pt-3 border-t border-white/20">
                  <div className="text-xs text-white/50 mb-1">Бележки:</div>
                  <p className="text-sm text-white">{selectedPhoto.notes}</p>
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
