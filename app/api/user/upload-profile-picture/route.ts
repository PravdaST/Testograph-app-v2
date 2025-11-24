import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateSessionAndEmail } from '@/lib/auth/validate-session'

/**
 * POST /api/user/upload-profile-picture
 * Uploads a profile picture to Supabase Storage and updates user record
 *
 * SECURITY: Requires valid session, users can only upload their own picture
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const formEmail = formData.get('email') as string

    // Validate session and get authenticated user's email
    const { email, error } = await validateSessionAndEmail(formEmail)
    if (error) return error

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${email.replace('@', '_').replace(/\./g, '_')}_${Date.now()}.${fileExt}`
    const filePath = fileName // Don't add 'profile-pictures/' - bucket already has that name

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Update user's profile_picture_url in quiz_results
    const { error: updateError } = await (supabase
      .from('quiz_results_v2') as any)
      .update({ profile_picture_url: publicUrl })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating profile picture URL:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error) {
    console.error('Error in upload-profile-picture POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/upload-profile-picture
 * Deletes the user's profile picture
 *
 * SECURITY: Requires valid session, users can only delete their own picture
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryEmail = searchParams.get('email')

    // Validate session and get authenticated user's email
    const { email, error } = await validateSessionAndEmail(queryEmail)
    if (error) return error

    const supabase = createServiceClient()

    // Get current profile picture URL
    const { data: userData } = await (supabase
      .from('quiz_results_v2') as any)
      .select('profile_picture_url')
      .eq('email', email)
      .single()

    if (userData?.profile_picture_url) {
      // Extract file path from URL
      const url = new URL(userData.profile_picture_url)
      const pathParts = url.pathname.split('/profile-pictures/')
      if (pathParts.length > 1) {
        const filePath = pathParts[1] // Just the filename, bucket already named 'profile-pictures'

        // Delete from storage
        await supabase.storage
          .from('profile-pictures')
          .remove([filePath])
      }
    }

    // Update user record to remove profile picture URL
    const { error: updateError } = await (supabase
      .from('quiz_results_v2') as any)
      .update({ profile_picture_url: null })
      .eq('email', email)

    if (updateError) {
      console.error('Error removing profile picture URL:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in upload-profile-picture DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
