export enum RecipeCategory {
  PRIMERO = 'primero',
  SEGUNDO = 'segundo',
  POSTRE = 'postre',
  ALL = 'all'
}

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  summary: string;
  fullDescription: string;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  rating: number;
  votes: number;
}

export interface RecipeResponse {
  recipes: Recipe[];
}