import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type DatabaseSchema = {
    status: Status
    auth_session: AuthSession
    auth_state: AuthState
}

export type Status = {
    uri: string
    authorDid: string
    status: string
    createdAt: string
    indexedAt: string
}

export type AuthSession = {
    key: string
    session: AuthSessionJson
}

export type AuthState = {
    key: string
    state: AuthStateJson
}

type AuthStateJson = string

type AuthSessionJson = string

export const createDb = (supabaseUrl: string, supabaseKey: string): SupabaseClient => {
    return createClient(supabaseUrl, supabaseKey)
}

export type Database = SupabaseClient

export interface AtclubCommonality {
    id: number
    did0: string
    did1: string
    commonalities: string
    created_at: string
    updated_at: string
}

export interface AtclubUser {
    id: number
    did: string
    bio: string | null
    github: string | null
    linkedin: string | null
    spotify: string | null
    youtube: string | null
    podcasts: string | null
    location: string | null
    created_at: string
    updated_at: string
}
