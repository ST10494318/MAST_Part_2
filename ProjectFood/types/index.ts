export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
}

export const COURSES = ['Starter', 'Main', 'Dessert', 'Side', 'Drink'] as const;
export type Course = typeof COURSES[number];