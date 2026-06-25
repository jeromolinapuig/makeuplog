import { Category } from './types';

const now = new Date().toISOString();

export const groupLabels = {
  makeup: 'Maquillaje',
  skincare: 'Skincare',
  hair: 'Pelo',
  other: 'Otros',
} as const;

export const initialCategories: Category[] = [
  ...['Base', 'Corrector', 'Polvos', 'Colorete', 'Bronzer', 'Iluminador', 'Sombras', 'Eyeliner', 'Mascara de pestanas', 'Cejas', 'Labial', 'Gloss', 'Fijador', 'Primer', 'Otros'].map((name) => ({
    id: `makeup-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    group: 'makeup' as const,
    createdAt: now,
  })),
  ...['Limpiador', 'Hidratante', 'Serum', 'Protector solar', 'Tonico', 'Contorno de ojos', 'Otros'].map((name) => ({
    id: `skincare-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    group: 'skincare' as const,
    createdAt: now,
  })),
  ...['Champu', 'Acondicionador', 'Mascarilla', 'Aceite', 'Protector termico', 'Styling', 'Otros'].map((name) => ({
    id: `hair-${name.toLowerCase().replaceAll(' ', '-')}`,
    name,
    group: 'hair' as const,
    createdAt: now,
  })),
];
