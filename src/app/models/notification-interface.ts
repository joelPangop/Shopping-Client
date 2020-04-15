import {Message} from './message-interface';

export interface Notification {
    _id?: string;
    title?: string;
    message: string;
    message_id?: string;
    utilisateurId?: string;
    article_id?: string;
    avatar: string;
    createdAt?: number;
    read?: boolean;
    sender: string;
    type?: string;
}
