export interface Product {
  id: string;
  name: string;
  category: 'belt' | 'buckle' | 'jewelry' | 'hat';
  price: number;
  image: string;
  images: string[];
  description: string;
  material: string;
  occasion: string[];
  finish: string;
  embossing?: string;
  pattern?: string;
  inStock: boolean;
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
