export interface Notification {
    id?: string;
    title?: string;
    message: string;
    utilisateurId?: string;
    avatar: string;
    createdAt?: number;
    read?: boolean;
    sender: string;
}
