import { Column } from "./column.model";

export interface Board {
    _id: string;  // MongoDB's id field
    id?: string;  // Optional alias for _id
    name: string;
    description: string;
    lastModified: Date;
    columns?: Column[];
    members: number;
    thumbnailColor: string;
    createdAt: Date;
    updatedAt: Date;
  }

  