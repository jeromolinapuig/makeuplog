import { Heart } from 'lucide-react';

type FavoriteButtonProps = {
  isFavorite: boolean;
  onClick: () => void;
};

export function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-pressed={isFavorite} aria-label={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}>
      <Heart className="button-icon" size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
      {isFavorite ? 'Favorito' : 'Favorito'}
    </button>
  );
}
