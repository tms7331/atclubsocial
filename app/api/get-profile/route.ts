import { NextResponse } from 'next/server'
import { createDb } from '@/utils/db'
import { createClientPublic } from '@/auth/client'
import { Agent } from '@atproto/api';

export async function GET(request: Request) {
    const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
    const publicClient = await createClientPublic()

    try {
        // Get the DID from the URL search params
        const { searchParams } = new URL(request.url)
        let did = searchParams.get('did')

        // Validate required field
        if (!did) {
            return NextResponse.json(
                { error: 'did parameter is required' },
                { status: 400 }
            )
        }

        // Query the profile data
        const { data, error } = await db
            .from('atclub_users')
            .select('*')
            .eq('did', did)
            .maybeSingle()

        if (error) throw error

        const agent = new Agent(publicClient);
        // Return our own profile if the did is fake...
        if (did.startsWith('fake')) {
            did = 'did:plc:z6tnolviceuaiiw66ossq3dj';
        }
        const profile = await agent.getProfile({ actor: did });

        return NextResponse.json({
            success: true,
            dbdata: data || null,
            atprofile: profile?.data || null
        })

    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
} 