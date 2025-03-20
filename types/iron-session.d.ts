import { IronSession } from 'iron-session';

export interface CustomIronSession extends IronSession {
    did?: string;
    destroy(): Promise<void>;
    save(): Promise<void>;
} 