import { Card } from './card.model';

export interface Column {
  id: string;
  name: string;
  order: number;
  cards: Card[];
  boardId: string;
}