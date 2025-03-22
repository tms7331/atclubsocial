import { NextResponse } from 'next/server'
import { createDb } from '@/utils/db'


export async function POST(request: Request) {
    const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    try {
        // Get did0 from request body
        const { did0 } = await request.json();
        if (!did0) {
            return NextResponse.json(
                { error: 'did0 parameter is required' },
                { status: 400 }
            );
        }

        // Fetch all other users except did0
        const { data: users, error: usersError } = await db
            .from('atclub_users')
            .select('did')
            .neq('did', did0);

        if (usersError) throw usersError;
        if (!users) throw new Error('No users found');

        // Create pairs only for the specified did0
        for (const user of users) {
            const { error: insertError } = await db
                .from('atclub_commonalities')
                .upsert({
                    did0: did0,
                    did1: user.did,
                    commonalities: 'lots in common!'
                }, {
                    onConflict: 'did0,did1'  // Update if entry already exists
                });

            if (insertError) {
                console.error('Error inserting commonality:', insertError);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Commonalities computed and stored'
        })
    } catch (error) {
        console.error('Error computing commonalities:', error)
        return NextResponse.json(
            { error: 'Failed to compute commonalities' },
            { status: 500 }
        )
    }
} 