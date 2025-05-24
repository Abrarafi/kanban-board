export interface Card {
    id: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | null;
    status: 'Not Started' | 'In Research' | 'On Track' | 'Completed';
    dueDate: Date | null;
    assignees: User[];
    columnId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
}