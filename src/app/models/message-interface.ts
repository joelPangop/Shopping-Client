import {Article} from './article-interface';

export interface Message {
    _id?: string;
    title?: string;
    picture?: string;
    utilisateurId?: string;
    content: string;
    createdAt: number;
    article?: Article;
    read: boolean;
    messageTo?: string;
}
