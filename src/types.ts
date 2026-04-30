export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  icon?: string;
  description?: string;
  fullDescription?: string;
  specifications?: Record<string, string>;
}

export type Page = 'home' | 'products' | 'services' | 'contact' | 'privacy' | 'terms';
