import { Category } from './types';

const now = new Date().toISOString();

export const groupLabels = {
  makeup: 'Maquillaje',
  skincare: 'Skincare',
  hair: 'Pelo',
  other: 'Otros',
} as const;

export const initialCategories: Category[] = [
  ...['Base', 'Corrector', 'Polvos', 'Colorete', 'Bronzer', 'Iluminador', 'Sombras', 'Eyeliner', 'Máscara de pestañas', 'Cejas', 'Labial', 'Gloss', 'Fijador', 'Primer', 'Otros'].map((name) => ({
    id: `makeup-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    group: 'makeup' as const,
    createdAt: now,
  })),
  ...['Limpiador', 'Hidratante', 'Sérum', 'Protector solar', 'Tónico', 'Contorno de ojos', 'Otros'].map((name) => ({
    id: `skincare-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    group: 'skincare' as const,
    createdAt: now,
  })),
  ...['Champú', 'Acondicionador', 'Mascarilla', 'Aceite', 'Protector térmico', 'Styling', 'Otros'].map((name) => ({
    id: `hair-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    group: 'hair' as const,
    createdAt: now,
  })),
];
