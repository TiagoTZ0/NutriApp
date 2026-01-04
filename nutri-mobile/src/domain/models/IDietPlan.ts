import type { IMeal } from './IMeal.js';

export interface IDietPlan {
  id: string;
  name: string;
  start_date: string;
  end_date?: string;
  kcal_target: number;
  is_flexible_global: boolean;
  meals: IMeal[]; // Árbol completo de comidas
}
