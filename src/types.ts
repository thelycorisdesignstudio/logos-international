export interface Product {
  id: number;
  name: string;
  category: string;
  icon?: string;
  description?: string;
  fullDescription?: string;
  specifications?: Record<string, string>;
}

export type Page = 'home' | 'products' | 'services' | 'coverage' | 'industries' | 'contact' | 'privacy' | 'terms';
