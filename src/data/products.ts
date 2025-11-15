import { Product } from '@/types/product';

export const products: Product[] = [
  // Leather Belts
  {
    id: 'belt-1',
    name: 'Alligator Dress Belt',
    category: 'belt',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
    ],
    description: 'Genuine American alligator leather belt with natural scale pattern. Hand-selected hides, superior edge finishing, and solid brass buckle. Each belt is unique with its own scale arrangement.',
    material: 'Alligator',
    occasion: ['Wedding', 'Evening Wear', 'Elevator Pitch'],
    finish: 'Full Grain',
    embossing: 'Alligator',
    pattern: 'Straight',
    inStock: true,
  },
  {
    id: 'belt-2',
    name: 'Tooled Leather Western Belt',
    category: 'belt',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80&sat=-20'
    ],
    description: 'Hand-tooled premium cowhide belt featuring intricate floral and geometric patterns. Each design is individually carved by skilled artisans. Features antique brass buckle and hand-stained finish.',
    material: 'Cowhide',
    occasion: ['Rock Concert', 'Sunday Golf'],
    finish: 'Top Grain',
    embossing: 'Tooled',
    pattern: 'Tapered',
    inStock: true,
  },
  {
    id: 'belt-3',
    name: 'Python Exotic Belt',
    category: 'belt',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&blend=444444&blend-mode=multiply',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&blend=444444&blend-mode=multiply',
      'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80&blend=333333&blend-mode=multiply'
    ],
    description: 'Stunning genuine python leather belt with natural diamond scale pattern. Hand-glazed finish enhances the exotic texture. Features sterling silver buckle and hand-painted edges.',
    material: 'Python',
    occasion: ['Evening Wear', 'Rock Concert'],
    finish: 'Smooth',
    embossing: 'Python',
    pattern: 'Straight',
    inStock: true,
  },
  {
    id: 'belt-4',
    name: 'Stingray Classic Belt',
    category: 'belt',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80&sat=-40',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80&sat=-40',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&sat=-30'
    ],
    description: 'Exceptionally durable stingray leather with distinctive pebbly texture and natural pearl-like luster. Water-resistant and scratch-resistant. Features scalloped edges and solid brass hardware.',
    material: 'Stingray',
    occasion: ['Polo club', 'Wedding'],
    finish: 'Nubuck',
    embossing: 'Stingray',
    pattern: 'Scallop',
    inStock: true,
  },
  
  // Silver Buckles
  {
    id: 'buckle-1',
    name: 'Silver Wyoming Spur Buckle',
    category: 'buckle',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'
    ],
    description: 'Hand-crafted .925 sterling silver buckle featuring intricate Wyoming wildflower design. Each petal and leaf is individually engraved by master silversmiths. Fits 1.5" belts.',
    material: 'Sterling Silver',
    occasion: ['Wedding', 'Rock Concert', 'Polo club'],
    finish: 'Polished Silver',
    inStock: true,
  },
  {
    id: 'buckle-2',
    name: 'Carved Silver Horseman Buckle',
    category: 'buckle',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80&sat=-20'
    ],
    description: 'Intricately carved sterling silver buckle featuring a dynamic horseman in full gallop. Antiqued finish highlights the detailed relief work. A tribute to western heritage and horsemanship.',
    material: 'Sterling Silver',
    occasion: ['Sunday Golf', 'Polo club'],
    finish: 'Antiqued Silver',
    inStock: true,
  },
  {
    id: 'buckle-3',
    name: 'Modern Minimal Silver Buckle',
    category: 'buckle',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80&sat=-50',
    images: [
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80&sat=-50',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80&sat=-40'
    ],
    description: 'Contemporary sterling silver buckle with sleek geometric design and brushed finish. Understated elegance for modern professionals. Lightweight yet substantial feel.',
    material: 'Sterling Silver',
    occasion: ['Evening Wear', 'Elevator Pitch'],
    finish: 'Brushed Silver',
    inStock: true,
  },
  {
    id: 'buckle-4',
    name: 'Engraved Ranch Buckle',
    category: 'buckle',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80&sat=-30',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80&sat=-30',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80&sat=-40'
    ],
    description: 'Hand-engraved sterling silver buckle depicting authentic ranch life scenes with cattle and mountain landscapes. Oxidized finish creates dramatic contrast. Each buckle is signed by the artist.',
    material: 'Sterling Silver',
    occasion: ['Rock Concert', 'Sunday Golf'],
    finish: 'Oxidized Silver',
    inStock: true,
  },
];
