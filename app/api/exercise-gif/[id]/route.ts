import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: exerciseId } = await params

  try {
    // Fetch exercise data from ExerciseDB API
    const response = await fetch(
      `https://${process.env.EXERCISEDB_API_HOST}/exercises/exercise/${exerciseId}`,
      {
        headers: {
          'x-rapidapi-key': process.env.EXERCISEDB_API_KEY || '',
          'x-rapidapi-host': process.env.EXERCISEDB_API_HOST || '',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch exercise' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Get the GIF URL from the response
    const gifUrl = data.gifUrl

    if (!gifUrl) {
      return NextResponse.json(
        { error: 'GIF URL not found' },
        { status: 404 }
      )
    }

    // Fetch the actual GIF
    const gifResponse = await fetch(gifUrl)

    if (!gifResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch GIF' },
        { status: gifResponse.status }
      )
    }

    // Get the image buffer
    const imageBuffer = await gifResponse.arrayBuffer()

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('Error fetching exercise GIF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
