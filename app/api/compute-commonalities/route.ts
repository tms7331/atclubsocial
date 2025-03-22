import { NextResponse } from 'next/server'
import { AtclubUser, createDb } from '@/utils/db'
import OpenAI from 'openai'
import { GithubData, LinkedinData, SpotifyData, YoutubeData, PodcastData, LocationData, ProfileData } from '@/app/types/profile';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

async function findCommonalities(user1: AtclubUser, user2: AtclubUser): Promise<string> {
    // Convert user data to ProfileData structure
    const formatUserData = (user: AtclubUser): ProfileData => ({
        bio: user.bio || undefined,
        sources: {
            Github: {
                imported: !!user.github,
                data: user.github ? { username: user.github } as GithubData : null
            },
            Linkedin: {
                imported: !!user.linkedin,
                data: user.linkedin ? { bio: user.linkedin } as LinkedinData : null
            },
            Spotify: {
                imported: !!user.spotify,
                data: user.spotify ? { topArtists: user.spotify } as SpotifyData : null
            },
            Youtube: {
                imported: !!user.youtube,
                data: user.youtube ? { channelsFollowed: user.youtube } as YoutubeData : null
            },
            Podcasts: {
                imported: !!user.podcasts,
                data: user.podcasts ? { favoritePodcasts: user.podcasts } as PodcastData : null
            },
            Location: {
                imported: !!user.location,
                data: user.location ? { city: user.location } as LocationData : null
            }
        }
    });

    const user1Profile = formatUserData(user1);
    const user2Profile = formatUserData(user2);

    const system_prompt = `Compare these two user profiles and identify key commonalities and shared interests. 
Return a brief, friendly summary of what they have in common.  Your response should be a single sentence describing the commonalities,
it should not contain any preface about the commonalities, just the commonalities themselves.
Finally your response should be directly addressed to user1, you should use terms like 'you both' instead of 'both users'.
`;

    const user_prompt = `
User 1: ${JSON.stringify(user1Profile)}
User 2: ${JSON.stringify(user2Profile)}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            { role: 'system', content: system_prompt },
            { role: "user", content: user_prompt }],
        temperature: 0.7,
        max_tokens: 200
    });
    return response.choices[0].message.content || "No commonalities found";
}

export async function POST(request: Request) {
    const db = createDb(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    try {
        const { did0 } = await request.json();
        if (!did0) {
            return NextResponse.json(
                { error: 'did0 parameter is required' },
                { status: 400 }
            );
        }

        // Fetch user0's data
        const { data: user0Data, error: user0Error } = await db
            .from('atclub_users')
            .select('*')  // Select all columns
            .eq('did', did0)
            .single();

        if (user0Error) throw user0Error;
        if (!user0Data) throw new Error('User0 not found');

        // Fetch all other users except did0
        const { data: users, error: usersError } = await db
            .from('atclub_users')
            .select('*')  // Select all columns
            .neq('did', did0);

        if (usersError) throw usersError;
        if (!users) throw new Error('No users found');

        // Create pairs and compute commonalities
        for (const user of users) {
            const commonalities = await findCommonalities(user0Data, user);

            const { error: insertError } = await db
                .from('atclub_commonalities')
                .upsert({
                    did0: did0,
                    did1: user.did,
                    commonalities: commonalities
                }, {
                    onConflict: 'did0,did1'
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