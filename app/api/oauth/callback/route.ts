import { createDb } from '@/utils/db';
import { createClient } from '@/auth/client';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { CustomIronSession } from '@/types/iron-session';

export async function GET(request: Request) {
    try {
        // Get URL parameters from the request URL
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Set up DB and OAuth client
        const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
        //await migrateToLatest(db);
        const oauthClient = await createClient(db);

        // Complete the OAuth flow
        const { session } = await oauthClient.callback(searchParams);

        // Create and save the session using iron-session
        const cookieStore = await cookies();
        const clientSession = await getIronSession<CustomIronSession>(cookieStore, {
            cookieName: "sid",
            password: process.env.COOKIE_SECRET!,
        });


        if (clientSession.did) {
            // Instead of throwing an error, try to restore the session
            try {
                const existingSession = await oauthClient.restore(clientSession.did);
                if (existingSession) {
                    // Session is still valid, just redirect
                    return Response.redirect(new URL('/', request.url));
                }
                // If restore fails, continue with new session
            } catch (err) {
                console.warn('Failed to restore existing session:', err);
                // Clear the invalid session
                await clientSession.destroy();
            }
        }

        clientSession.did = session.did;
        await clientSession.save();

        // Redirect to home page on success
        return Response.redirect(new URL('/', request.url));
    } catch (error) {
        console.error('Error in callback endpoint:', error);
        // Redirect to home page with error on failure
        return Response.redirect(new URL('/?error', request.url));
    }
}