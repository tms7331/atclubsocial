import { NextResponse } from 'next/server'
import { createDb } from '@/utils/db'

export async function POST(request: Request) {
    const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    try {
        const body = await request.json()
        const {
            did,
            bio,
            github,
            linkedin,
            spotify,
            youtube,
            podcasts,
            location
        } = body

        // Validate required field
        if (!did) {
            return NextResponse.json(
                { error: 'did is required' },
                { status: 400 }
            )
        }

        // Upsert the profile data
        const { data, error } = await db
            .from('atclub_users')
            .upsert({
                did,
                bio,
                github,
                linkedin,
                spotify,
                youtube,
                podcasts,
                location,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'did'  // Update if did exists
            })
            .select()

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data
        })

    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
} 