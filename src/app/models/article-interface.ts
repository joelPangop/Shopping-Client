export interface Article {
    title: string;
    price: number;
    description: string;
    category: string;
    pictures: string[];
    likes?: string[];
    averageStar?: number;
    state: string;
    city: string;
    createdAt?: number;
    _id?: string;
    utilisateurId?: string;
    owner?: string;
    availability: Availability;
}

export interface Availability {
    available: boolean;
    type?: string;
    feed?: number;
    address?: string;
}
