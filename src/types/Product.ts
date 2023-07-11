import { Category } from './Category';
import { User } from './User';

export interface Product {
  id: number;
  categoryId: number;
  name: string;

  user: User | null;
  category?: Category;
}
