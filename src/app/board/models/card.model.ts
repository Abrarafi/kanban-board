export interface Card {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    status?: 'Not Started' | 'In Research' | 'On Track' | 'Completed';
    assignee?: {
      id: string;
      name: string;
      avatar?: string;
    };
    columnId: string;
    createdAt: Date;
    updatedAt: Date;
  }