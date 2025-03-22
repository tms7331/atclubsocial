import { NextResponse } from 'next/server'
import { createDb } from '@/utils/db'


export async function GET(request: Request) {
    const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    try {
        // Get did0 from URL parameters
        const { searchParams } = new URL(request.url)
        const did0 = searchParams.get('did0')

        if (!did0) {
            return NextResponse.json(
                { error: 'did0 parameter is required' },
                { status: 400 }
            )
        }

        // Query commonalities where did0 matches
        const { data: commonalities, error } = await db
            .from('atclub_commonalities')
            .select(`
                did0,
                did1,
                commonalities
            `)
            .eq('did0', did0)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({
            success: true,
            commonalities
        })

    } catch (error) {
        console.error('Error fetching commonalities:', error)
        return NextResponse.json(
            { error: 'Failed to fetch commonalities' },
            { status: 500 }
        )
    }
} 