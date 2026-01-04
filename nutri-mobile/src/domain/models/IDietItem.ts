import type { IFood } from './IFood.js';

export interface IDietItem {
  id: string;
  quantity_grams: number;
  portion_display?: string; // Ej: "1 taza", "2 filetes"
  is_flexible: boolean;
  food: IFood; // Objeto anidado completo
}
