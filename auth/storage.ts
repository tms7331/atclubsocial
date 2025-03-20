import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@atproto/oauth-client-node'
import type { Database } from '@/utils/db'

export class StateStore implements NodeSavedStateStore {
  constructor(private db: Database) { }

  async get(key: string): Promise<NodeSavedState | undefined> {
    const { data, error } = await this.db
      .from('auth_state')
      .select('*')
      .eq('key', key)
      .single()

    if (error || !data) return undefined
    return JSON.parse(data.state) as NodeSavedState
  }

  async set(key: string, val: NodeSavedState) {
    const state = JSON.stringify(val)
    const { error } = await this.db
      .from('auth_state')
      .upsert(
        { key, state },
        { onConflict: 'key' }
      )
    if (error) throw error
  }

  async del(key: string) {
    const { error } = await this.db
      .from('auth_state')
      .delete()
      .eq('key', key)
    if (error) throw error
  }
}

export class SessionStore implements NodeSavedSessionStore {
  constructor(private db: Database) { }

  async get(key: string): Promise<NodeSavedSession | undefined> {
    const { data, error } = await this.db
      .from('auth_session')
      .select('*')
      .eq('key', key)
      .single()

    if (error || !data) return undefined
    return JSON.parse(data.session) as NodeSavedSession
  }

  async set(key: string, val: NodeSavedSession) {
    const session = JSON.stringify(val)
    const { error } = await this.db
      .from('auth_session')
      .upsert(
        { key, session },
        { onConflict: 'key' }
      )
    if (error) throw error
  }

  async del(key: string) {
    const { error } = await this.db
      .from('auth_session')
      .delete()
      .eq('key', key)
    if (error) throw error
  }
}
