import { User } from "../../shared/models/user.model";

export interface Card {
    _id?: string;  // MongoDB ID
    id: string;    // Frontend ID
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

