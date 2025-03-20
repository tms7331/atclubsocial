import { getIronSession } from 'iron-session';
import { createDb } from '@/utils/db';
import { createClient } from '@/auth/client';
import { Agent } from '@atproto/api';
import { cookies } from 'next/headers';
import { CustomIronSession } from '@/types/iron-session';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<CustomIronSession>(cookieStore, {
            cookieName: "sid",
            password: process.env.COOKIE_SECRET!,
        });

        if (!session.did) {
            return Response.json({ profile: null });
        }

        // Set up DB and OAuth client
        const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
        // await migrateToLatest(db);
        const oauthClient = await createClient(db);

        try {
            // Restore the session
            const oauthSession = await oauthClient.restore(session.did);

            // Check if session is valid and create agent
            if (!oauthSession) {
                return Response.json({ profile: null });
            }
            const agent = new Agent(oauthSession);
            const profile = await agent.getProfile({ actor: agent.assertDid });

            return Response.json({ profile: profile.data });
        } catch (err) {
            // Clear invalid session
            // await session.destroy();
            return Response.json({ profile: null });
        }
    } catch (error) {
        return Response.json({ error: 'Failed to get profile' }, { status: 500 });
    }
} 