export interface IChatMessage {
    id: string;
    userId: string;
    userEmail?: string;
    content: string;
    createdAt: Date;
}
