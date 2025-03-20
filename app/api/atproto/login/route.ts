import { createDb } from '@/utils/db';
import { createClient } from '@/auth/client';

export async function POST(request: Request) {
    try {
        const { handle } = await request.json();

        const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
        const oauthClient = await createClient(db);

        const url = await oauthClient.authorize(handle, {
            scope: "atproto transition:generic",
        });

        return Response.json({ url: url.toString() });
    } catch (error) {
        console.error('Error in login endpoint:', error);
        return Response.json(
            { error: 'Failed to generate authorization URL' },
            { status: 500 }
        );
    }
} 