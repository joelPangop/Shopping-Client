export interface Notification {
    id?: string;
    title?: string;
    message: string;
    utilisateurId?: string;
    avatar: string;
    createAt: number;
    read?: boolean;
    sender: string;
}
