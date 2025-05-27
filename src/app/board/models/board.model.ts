import { Column } from "./column.model";

export interface Board {
    id: string;
    name: string;
    description: string;
    lastModified: Date;
    columns?: Column[];
    members: number;
    thumbnailColor: string;
    createdAt: Date;
    updatedAt: Date;
  }

  