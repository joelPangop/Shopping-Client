export interface Message {
    _id?: string;
    title?: string;
    picture?: string;
    utilisateurId?: string;
    content: string;
    createdAt: number;
    read: boolean;
    messageTo?: string;
}
