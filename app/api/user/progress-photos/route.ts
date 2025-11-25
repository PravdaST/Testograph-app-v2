import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * GET /api/user/progress-photos
 * Fetch all progress photos for the authenticated user
 *
 * Query params: email (optional - falls back to session)
 * Returns: Array of progress photos sorted by date DESC
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    // 2. Fetch all progress photos for user
    const supabaseService = createServiceClient()
    const { data: photos, error: fetchError } = await (supabaseService
      .from('progress_photos') as any)
      .select('*')
      .eq('email', email)
      .order('date', { ascending: false })

    if (fetchError) {
      console.error('Error fetching progress photos:', fetchError)
      return NextResponse.json(
        { error: 'Грешка при зареждане на снимките' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      photos: photos || [],
      count: photos?.length || 0,
    })
  } catch (error) {
    console.error('Error in GET progress-photos:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/progress-photos
 * Upload a new progress photo
 *
 * Body: FormData with:
 *  - file: Image file (JPEG/PNG/WebP)
 *  - date: Date string (YYYY-MM-DD)
 *  - weight?: Optional weight in kg
 *  - body_fat_pct?: Optional body fat percentage
 *  - notes?: Optional notes
 *
 * Returns: Created progress photo record with photo_url
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    // 2. Parse FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const date = formData.get('date') as string
    const weight = formData.get('weight') as string | null
    const bodyFatPct = formData.get('body_fat_pct') as string | null
    const notes = formData.get('notes') as string | null

    if (!file || !date) {
      return NextResponse.json(
        { error: 'Файлът и датата са задължителни' },
        { status: 400 }
      )
    }

    // 3. Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Невалиден формат на снимката. Позволени: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    // 4. Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Снимката е твърде голяма. Максимален размер: 10MB' },
        { status: 400 }
      )
    }

    // 5. Generate unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${email.replace('@', '_')}_${timestamp}.${fileExt}`

    // 6. Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError)
      return NextResponse.json(
        { error: 'Грешка при качване на снимката' },
        { status: 500 }
      )
    }

    // 7. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName)

    // 8. Insert record into database
    const supabaseService = createServiceClient()
    const { data: photoRecord, error: insertError } = await (supabaseService
      .from('progress_photos') as any)
      .insert({
        email,
        photo_url: publicUrl,
        date,
        weight: weight ? parseFloat(weight) : null,
        body_fat_pct: bodyFatPct ? parseFloat(bodyFatPct) : null,
        notes: notes || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting photo record:', insertError)
      // Cleanup: delete uploaded file if database insert fails
      await supabase.storage.from('progress-photos').remove([fileName])
      return NextResponse.json(
        { error: 'Грешка при запазване на снимката' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Снимката е качена успешно',
      photo: photoRecord,
    })
  } catch (error) {
    console.error('Error in POST progress-photos:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/progress-photos
 * Delete a progress photo
 *
 * Query params:
 *  - id: Photo ID (UUID)
 *
 * Security: Deletes both the database record AND the file from storage
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photoId = searchParams.get('id')

    if (!photoId) {
      return NextResponse.json(
        { error: 'Photo ID е задължително' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма активна сесия' },
        { status: 401 }
      )
    }

    const email = session.user.email

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - Няма email в сесията' },
        { status: 401 }
      )
    }

    const supabaseService = createServiceClient()

    // 2. Fetch photo record to get photo_url and verify ownership
    const { data: photo, error: fetchError } = await (supabaseService
      .from('progress_photos') as any)
      .select('*')
      .eq('id', photoId)
      .eq('email', email)
      .single()

    if (fetchError || !photo) {
      return NextResponse.json(
        { error: 'Снимката не е намерена или нямате достъп до нея' },
        { status: 404 }
      )
    }

    // 3. Delete from database
    const { error: deleteError } = await (supabaseService
      .from('progress_photos') as any)
      .delete()
      .eq('id', photoId)
      .eq('email', email)

    if (deleteError) {
      console.error('Error deleting photo record:', deleteError)
      return NextResponse.json(
        { error: 'Грешка при изтриване на снимката от базата данни' },
        { status: 500 }
      )
    }

    // 4. Extract filename from photo_url and delete from storage
    const fileName = photo.photo_url.split('/').pop()
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('progress-photos')
        .remove([fileName])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
        // Don't fail the request if storage delete fails (record is already deleted)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Снимката е изтрита успешно',
    })
  } catch (error) {
    console.error('Error in DELETE progress-photos:', error)
    return NextResponse.json(
      { error: 'Вътрешна грешка на сървъра' },
      { status: 500 }
    )
  }
}
