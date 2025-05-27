import { User } from "../../shared/models/user.model";

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

