import type { IDietItem } from './IDietItem.js';

export interface IMeal {
  id: string;
  name: string; // "Desayuno", "Almuerzo"
  order_index: number;
  time_of_day?: string; 
  items: IDietItem[]; // Array de items
  total_calories?: number; // Calculado por backend
}
