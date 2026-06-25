type FavoriteButtonProps = {
  isFavorite: boolean;
  onClick: () => void;
};

export function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-pressed={isFavorite} aria-label={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}>
      {isFavorite ? 'Favorito' : 'Favorito'}
    </button>
  );
}
