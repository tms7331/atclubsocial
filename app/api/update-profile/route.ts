import { NextResponse } from 'next/server'
import { createDb } from '@/utils/db'
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { createClient } from '@/auth/client';
import { TID } from '@atproto/common'
import { Agent } from '@atproto/api';
import { CustomIronSession } from '@/types/iron-session';

export async function POST(request: Request) {
    const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    try {
        // Get session
        const cookieStore = await cookies();
        const session = await getIronSession<CustomIronSession>(cookieStore, {
            cookieName: "sid",
            password: process.env.COOKIE_SECRET!,
        });

        // Check if user is authenticated
        if (!session.did) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

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

        // First update the local database
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
                onConflict: 'did'
            })
            .select()

        if (error) throw error

        // Now update the AT Protocol record
        const oauthClient = await createClient(db);
        const oauthSession = await oauthClient.restore(session.did);
        const agent = new Agent(oauthSession);

        const rkey = TID.nextStr();
        const record = {
            $type: 'atclub.social.profile',
            bio,
            github,
            linkedin,
            spotify,
            youtube,
            podcasts,
            location,
            updatedAt: new Date().toISOString(),
        };

        try {
            await agent.com.atproto.repo.putRecord({
                repo: agent.assertDid,
                collection: 'atclub.social.test',
                rkey,
                record,
                validate: false,
            });
        } catch (err) {
            console.warn('Failed to write AT Protocol record:', err);
            // Continue execution as this is non-critical
        }

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