'use client'

/**
 * Profile Page - Bento Grid Layout
 * Modern profile overview with stats and settings
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { FeedbackHistory } from '@/components/profile/FeedbackHistory'
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { ProgressPhotoGallery } from '@/components/profile/ProgressPhotoGallery'
import { MeasurementsTracker } from '@/components/profile/MeasurementsTracker'
import { ProgramHistory } from '@/components/profile/ProgramHistory'
import { ActiveSessions } from '@/components/profile/ActiveSessions'
import { useUserProgram } from '@/contexts/UserProgramContext'
import { useToast } from '@/contexts/ToastContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useUserStats, useFeedbackHistory } from '@/lib/hooks/useSWR'
import { createClient } from '@/lib/supabase/client'
import {
  User, Mail, Calendar, TrendingUp, ArrowLeft, Camera, Target, Edit2,
  Check, X, Loader2, Trash2, Settings, LogOut, Home,
  Dumbbell as DumbbellIcon, AlertTriangle, Utensils, Moon, Pill,
  BarChart3, Award, ChevronRight, Info, Leaf, Sun, Download
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  total_score: number
  workout_location?: 'home' | 'gym'
  dietary_preference?: 'omnivor' | 'pescatarian' | 'vegetarian' | 'vegan'
  completed_at?: string
  profile_picture_url?: string
  goal?: string
  program_end_date?: string
  first_name?: string
  breakdown?: {
    symptoms: number
    nutrition: number
    training: number
    sleep_recovery: number
    context: number
  }
  // Account metadata from Supabase Auth
  account_created_at?: string
  last_sign_in_at?: string
  email_confirmed_at?: string | null
  is_email_verified?: boolean
}


const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

const LOCATION_NAMES = {
  home: 'Вкъщи',
  gym: 'Фитнес зала',
}

const DIETARY_PREFERENCE_NAMES = {
  omnivor: 'Omnivore (всичко)',
  pescatarian: 'Pescatarian',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
}

export default function ProfilePage() {
  const router = useRouter()
  const toast = useToast()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { email, userProgram, loading: contextLoading, updateUserProgram } = useUserProgram()

  // SWR hooks for data fetching
  const { stats: userStats, isLoading: statsLoading } = useUserStats()
  const { submissions: feedbackHistory, isLoading: feedbackLoading } = useFeedbackHistory()

  const loading = contextLoading || statsLoading || feedbackLoading
  const [userName, setUserName] = useState<string>()
  const [firstName, setFirstName] = useState<string>('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameText, setNameText] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalText, setGoalText] = useState('')
  const [isSavingGoal, setIsSavingGoal] = useState(false)
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTooltip, setActiveTooltip] = useState<'hero' | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeletePictureModal, setShowDeletePictureModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isExportingData, setIsExportingData] = useState(false)

  useEffect(() => {
    if (!email || !userProgram) return

    // Set goal and name from userProgram
    setGoalText(userProgram.goal || '')

    // Set firstName and userName for TopNav
    if (userProgram.first_name) {
      setFirstName(userProgram.first_name)
      setNameText(userProgram.first_name)
      setUserName(userProgram.first_name)
    } else {
      const namePart = email.split('@')[0]
      setUserName(namePart)
      setFirstName('')
      setNameText('')
    }
  }, [email, userProgram])

  const handleSaveName = async () => {
    if (!email || !nameText.trim()) return

    setIsSavingName(true)
    try {
      const response = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: nameText.trim() })
      })

      if (response.ok) {
        setFirstName(nameText.trim())
        setUserName(nameText.trim())
        setIsEditingName(false)
      }
    } catch (error) {
      console.error('Error saving name:', error)
    } finally {
      setIsSavingName(false)
    }
  }

  const handleSaveGoal = async () => {
    if (!email || !goalText.trim()) return

    setIsSavingGoal(true)
    try {
      const response = await fetch('/api/user/update-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, goal: goalText.trim() })
      })

      if (response.ok) {
        updateUserProgram({ goal: goalText.trim() })
        setIsEditingGoal(false)
      }
    } catch (error) {
      console.error('Error saving goal:', error)
    } finally {
      setIsSavingGoal(false)
    }
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !email) return

    setIsUploadingPicture(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', email)

      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        updateUserProgram({ profile_picture_url: data.url })
        toast.success('Профилната снимка е качена успешно')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Грешка при качване на снимката')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast.error('Грешка при качване на снимката')
    } finally {
      setIsUploadingPicture(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteProfilePicture = () => {
    if (!email || !userProgram?.profile_picture_url) return
    setShowDeletePictureModal(true)
  }

  const confirmDeleteProfilePicture = async () => {
    if (!email) return

    setIsUploadingPicture(true)
    try {
      const response = await fetch(`/api/user/upload-profile-picture?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        updateUserProgram({ profile_picture_url: undefined })
        setShowDeletePictureModal(false)
        toast.success('Профилната снимка е изтрита')
      } else {
        toast.error('Грешка при изтриване на снимката')
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      toast.error('Грешка при изтриване на снимката')
    } finally {
      setIsUploadingPicture(false)
    }
  }

  const calculateDaysRemaining = () => {
    if (!userProgram?.program_end_date) return null

    const endDate = new Date(userProgram.program_end_date)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const calculateProgramProgress = () => {
    if (!userProgram?.completed_at || !userProgram?.program_end_date) return 0

    const startDate = new Date(userProgram.completed_at)
    const endDate = new Date(userProgram.program_end_date)
    const today = new Date()

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return Math.min(Math.round((daysPassed / totalDays) * 100), 100)
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.clear()
    router.push('/login')
  }

  const handleChangeWorkoutLocation = async () => {
    if (!email || !userProgram) return

    const newLocation = userProgram.workout_location === 'home' ? 'gym' : 'home'

    try {
      const response = await fetch('/api/user/update-workout-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, workout_location: newLocation })
      })

      if (response.ok) {
        updateUserProgram({ workout_location: newLocation })
        toast.success(`Локацията е променена на ${LOCATION_NAMES[newLocation]}`)
      } else {
        toast.error('Грешка при промяна на локацията')
      }
    } catch (error) {
      console.error('Error changing workout location:', error)
      toast.error('Грешка при промяна на локацията')
    }
  }

  const handleChangeDietaryPreference = async () => {
    if (!email || !userProgram) return

    const currentPreference = userProgram.dietary_preference || 'omnivor'
    const preferences: ('omnivor' | 'pescatarian' | 'vegetarian' | 'vegan')[] = ['omnivor', 'pescatarian', 'vegetarian', 'vegan']
    const currentIndex = preferences.indexOf(currentPreference)
    const newPreference = preferences[(currentIndex + 1) % preferences.length]

    try {
      const response = await fetch('/api/user/dietary-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, dietary_preference: newPreference })
      })

      if (response.ok) {
        updateUserProgram({ dietary_preference: newPreference })
        toast.success(`Хранителното предпочитание е ${DIETARY_PREFERENCE_NAMES[newPreference]}`)
      } else {
        toast.error('Грешка при промяна на хранителното предпочитание')
      }
    } catch (error) {
      console.error('Error changing dietary preference:', error)
      toast.error('Грешка при промяна на хранителното предпочитание')
    }
  }

  const handleChangePassword = () => {
    setShowChangePasswordModal(true)
    setPasswordError('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8) {
      return 'Паролата трябва да е поне 8 символа'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Паролата трябва да съдържа поне една главна буква'
    }
    if (!/[a-z]/.test(password)) {
      return 'Паролата трябва да съдържа поне една малка буква'
    }
    if (!/[0-9]/.test(password)) {
      return 'Паролата трябва да съдържа поне една цифра'
    }
    return null
  }

  const confirmChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Всички полета са задължителни')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Новата парола и потвърждението не съвпадат')
      return
    }

    const strengthError = validatePasswordStrength(newPassword)
    if (strengthError) {
      setPasswordError(strengthError)
      return
    }

    setIsChangingPassword(true)
    setPasswordError('')

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Паролата е променена успешно')
        setShowChangePasswordModal(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordError(data.error || 'Грешка при промяна на паролата')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordError('Грешка при промяна на паролата')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    setIsResendingEmail(true)

    try {
      const response = await fetch('/api/user/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification email е изпратен! Проверете входящата си поща.')
      } else {
        toast.error(data.error || 'Грешка при изпращане на email')
      }
    } catch (error) {
      console.error('Error resending verification email:', error)
      toast.error('Грешка при изпращане на verification email')
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleChangeEmail = () => {
    setShowChangeEmailModal(true)
    setEmailError('')
    setNewEmail('')
    setEmailPassword('')
  }

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const confirmChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      setEmailError('Email и парола са задължителни')
      return
    }

    if (!validateEmailFormat(newEmail)) {
      setEmailError('Невалиден email формат')
      return
    }

    if (newEmail.toLowerCase() === email?.toLowerCase()) {
      setEmailError('Новият email е същият като текущия')
      return
    }

    setIsChangingEmail(true)
    setEmailError('')

    try {
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail,
          password: emailPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification email е изпратен! Проверете входящата поща на новия адрес.')
        setShowChangeEmailModal(false)
        setNewEmail('')
        setEmailPassword('')
      } else {
        setEmailError(data.error || 'Грешка при промяна на email')
      }
    } catch (error) {
      console.error('Error changing email:', error)
      setEmailError('Грешка при промяна на email')
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const handleExportData = async () => {
    setIsExportingData(true)

    try {
      const response = await fetch('/api/user/export-data')

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `testograph_data_${email?.replace('@', '_')}_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast.success('Данните са изтеглени успешно!')
      } else {
        toast.error('Грешка при изтегляне на данните')
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Грешка при изтегляне на данните')
    } finally {
      setIsExportingData(false)
    }
  }

  const confirmDeleteAccount = async () => {
    if (!email) return

    const response = await fetch(`/api/user/delete-account?email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      const supabase = createClient()
      await supabase.auth.signOut()
      localStorage.clear()
      router.push('/quiz')
    } else {
      throw new Error('Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const programName = userProgram ? CATEGORY_NAMES[userProgram.category] : 'Програма'
  const startDate = userProgram?.completed_at
    ? new Date(userProgram.completed_at).toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-'

  const daysRemaining = calculateDaysRemaining()
  const programProgress = calculateProgramProgress()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <TopNav programName={programName} userName={userName} profilePictureUrl={userProgram?.profile_picture_url} />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Back Button */}
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад към Dashboard
        </Link>

        {/* Hero Section - Profile Picture + Name */}
        <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'hero' ? null : 'hero')
            }}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50 transition-colors z-10"
          >
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
          {activeTooltip === 'hero' && typeof window !== 'undefined' && createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(null)
                }}
              />
              <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-bold text-foreground">Профил</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTooltip(null)
                    }}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Проследи своя прогрес и персонализирай профила си. Виж Quiz резултатите, статистики и историята на обратната връзка.
                </p>
              </div>
            </>,
            document.body
          )}
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center ring-4 ring-primary/10">
                {userProgram?.profile_picture_url ? (
                  <Image
                    src={userProgram.profile_picture_url}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload/Loading Button */}
              <button
                onClick={handleProfilePictureClick}
                disabled={isUploadingPicture}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
              >
                {isUploadingPicture ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Delete Button */}
              {userProgram?.profile_picture_url && !isUploadingPicture && (
                <button
                  onClick={handleDeleteProfilePicture}
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Name + Email */}
            <div className="flex-1">
              {isEditingName ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nameText}
                    onChange={(e) => setNameText(e.target.value)}
                    placeholder="Твоето име..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 text-xs"
                    >
                      <Check className="w-3 h-3" />
                      {isSavingName ? 'Запазва...' : 'Запази'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false)
                        setNameText(firstName)
                      }}
                      className="flex items-center gap-1 px-3 py-1 border border-border rounded-lg hover:bg-muted text-xs"
                    >
                      <X className="w-3 h-3" />
                      Отказ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {firstName || userName || 'Потребител'}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 hover:bg-background/50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{programName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid - Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Quiz Score (1x1) */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-5 border-2 border-primary/30 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <Award className="w-6 h-6 text-primary mb-2" />
            <div className="text-4xl font-bold text-primary mb-1">
              {userProgram?.total_score || 0}
            </div>
            <div className="text-xs text-muted-foreground">Quiz Score</div>
          </div>

          {/* Program Progress (1x1) */}
          <div className="bg-background rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Calendar className="w-6 h-6 text-primary mb-2" />
            <div className="text-4xl font-bold mb-1">{programProgress}%</div>
            <div className="text-xs text-muted-foreground">
              {daysRemaining && daysRemaining > 0 ? `${daysRemaining} дни остават` : 'Прогрес'}
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        {userProgram && (
          <div className="bg-background rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Account Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Account Created */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Регистриран на</div>
                <div className="text-sm font-medium">
                  {userProgram.account_created_at
                    ? new Date(userProgram.account_created_at).toLocaleDateString('bg-BG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </div>
              </div>

              {/* Last Login */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Последен вход</div>
                <div className="text-sm font-medium">
                  {userProgram.last_sign_in_at
                    ? new Date(userProgram.last_sign_in_at).toLocaleDateString('bg-BG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </div>
              </div>

              {/* Email Verification Status */}
              <div className="space-y-1 col-span-2">
                <div className="text-xs text-muted-foreground">Email статус</div>
                {userProgram.is_email_verified ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <Check className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">Email потвърден</p>
                      <p className="text-xs text-green-600 dark:text-green-500">Вашият email адрес е верифициран</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Email не е потвърден</p>
                        <p className="text-xs text-amber-600 dark:text-amber-500">Моля потвърдете email адреса си</p>
                      </div>
                    </div>
                    <button
                      onClick={handleResendVerificationEmail}
                      disabled={isResendingEmail}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                      {isResendingEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Изпраща се...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Изпрати verification email
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Program Days */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Дни в програмата</div>
                <div className="text-sm font-medium">
                  {userProgram.completed_at
                    ? Math.max(
                        Math.ceil(
                          (new Date().getTime() - new Date(userProgram.completed_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ),
                        1
                      )
                    : '-'}{' '}
                  дни
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid (4 tiles) */}
        {userStats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Utensils className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.mealsCompleted}</div>
              <div className="text-xs text-muted-foreground">хранения</div>
            </div>

            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <DumbbellIcon className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.workoutsCompleted}</div>
              <div className="text-xs text-muted-foreground">тренировки</div>
            </div>

            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <Moon className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.averageSleepHours}ч</div>
              <div className="text-xs text-muted-foreground">сън</div>
            </div>

            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <Pill className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.testoUpCompliance}%</div>
              <div className="text-xs text-muted-foreground">TestoUp</div>
            </div>
          </div>
        )}

        {/* Progress Photo Gallery */}
        {email && <ProgressPhotoGallery email={email} />}

        {/* Body Measurements Tracker */}
        {email && <MeasurementsTracker email={email} />}

        {/* Program History */}
        {email && <ProgramHistory email={email} />}

        {/* Active Sessions */}
        {email && <ActiveSessions email={email} />}

        {/* Goal Section */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Моята цел за 30 дни</h2>
            </div>
            {!isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isEditingGoal ? (
            <div className="space-y-3">
              <textarea
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="Напр. Искам да се чувствам по-енергичен и да свал 5 кг..."
                className="w-full p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveGoal}
                  disabled={isSavingGoal}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isSavingGoal ? 'Запазва се...' : 'Запази'}
                </button>
                <button
                  onClick={() => {
                    setIsEditingGoal(false)
                    setGoalText(userProgram?.goal || '')
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                  Отказ
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/30">
              {userProgram?.goal ? (
                <p className="text-sm">{userProgram.goal}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Още не сте задали цел. Кликнете бутона за редактиране, за да добавите.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Settings & Actions */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Настройки</h2>
          </div>

          <div className="space-y-2">
            {/* Change Password */}
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-medium">Смени паролата</p>
                  <p className="text-xs text-muted-foreground">
                    Промени паролата за достъп до профила
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Change Email */}
            <button
              onClick={handleChangeEmail}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-medium">Смени email адреса</p>
                  <p className="text-xs text-muted-foreground">
                    Промени email адреса за вход в профила
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Workout Location */}
            {userProgram?.workout_location && (
              <button
                onClick={handleChangeWorkoutLocation}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {userProgram.workout_location === 'home' ? (
                    <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <DumbbellIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">Тренировъчна локация</p>
                    <p className="text-xs text-muted-foreground">
                      Текуща: {LOCATION_NAMES[userProgram.workout_location]}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Dietary Preference */}
            <button
              onClick={handleChangeDietaryPreference}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-medium">Хранително предпочитание</p>
                  <p className="text-xs text-muted-foreground">
                    Текущо: {DIETARY_PREFERENCE_NAMES[userProgram?.dietary_preference || 'omnivor']}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Theme Toggle */}
            <div className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 group">
              <div className="flex items-center gap-3">
                {resolvedTheme === 'dark' ? (
                  <Moon className="w-5 h-5 text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium">Тъмен режим</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'system' ? 'Системен' : resolvedTheme === 'dark' ? 'Включен' : 'Изключен'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Theme selector buttons */}
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  title="Светъл"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  title="Тъмен"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Export Data (GDPR) */}
            <button
              onClick={handleExportData}
              disabled={isExportingData}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-medium">Изтегли данните си</p>
                  <p className="text-xs text-muted-foreground">
                    Експортирай всички данни (GDPR)
                  </p>
                </div>
              </div>
              {isExportingData ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-medium">Излез от профила</p>
                  <p className="text-xs text-muted-foreground">
                    Ще можете да влезете отново с имейла си
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/30 group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div className="text-left">
                  <p className="text-sm font-medium text-destructive">Изтрий профила</p>
                  <p className="text-xs text-muted-foreground">
                    Необратимо изтриване на всички данни
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>

        {/* Feedback History */}
        <FeedbackHistory submissions={feedbackHistory} />
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
      />

      {/* Logout Confirm Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Излез от профила"
        message="Сигурни ли сте, че искате да излезете? Ще можете да влезете отново с имейла си."
        confirmText="Излез"
        cancelText="Отказ"
        variant="default"
        icon="logout"
      />

      {/* Delete Profile Picture Confirm Modal */}
      <ConfirmModal
        isOpen={showDeletePictureModal}
        onClose={() => setShowDeletePictureModal(false)}
        onConfirm={confirmDeleteProfilePicture}
        title="Изтрий профилната снимка"
        message="Сигурни ли сте, че искате да изтриете профилната си снимка?"
        confirmText="Изтрий"
        cancelText="Отказ"
        variant="danger"
        icon="trash"
        isLoading={isUploadingPicture}
      />

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Смени паролата</h2>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium mb-2 block">Текуща парола</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Въведете текущата си парола"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium mb-2 block">Нова парола</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Въведете нова парола"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Поне 8 символа, главна буква, малка буква и цифра
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-sm font-medium mb-2 block">Потвърди нова парола</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Въведете новата парола отново"
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{passwordError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={isChangingPassword}
                >
                  Отказ
                </button>
                <button
                  onClick={confirmChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Запазване...
                    </>
                  ) : (
                    'Смени паролата'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showChangeEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Смени email адреса</h2>
              <button
                onClick={() => setShowChangeEmailModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Email Display */}
              <div>
                <label className="text-sm font-medium mb-2 block">Текущ email</label>
                <div className="px-4 py-2 rounded-lg border border-border bg-muted/30 text-muted-foreground">
                  {email}
                </div>
              </div>

              {/* New Email */}
              <div>
                <label className="text-sm font-medium mb-2 block">Нов email адрес</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Въведете нов email адрес"
                />
              </div>

              {/* Password Confirmation */}
              <div>
                <label className="text-sm font-medium mb-2 block">Потвърди паролата</label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Въведете паролата си за потвърждение"
                />
              </div>

              {/* Info Message */}
              <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Ще изпратим verification email към новия адрес. Трябва да кликнете на линка в email-а за да потвърдите промяната.
                </p>
              </div>

              {/* Error Message */}
              {emailError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{emailError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowChangeEmailModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={isChangingEmail}
                >
                  Отказ
                </button>
                <button
                  onClick={confirmChangeEmail}
                  disabled={isChangingEmail}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isChangingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Изпращане...
                    </>
                  ) : (
                    'Промени email'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
