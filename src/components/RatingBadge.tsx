import { ratingText } from '../utils/products';

type RatingBadgeProps = {
  rating?: number;
};

export function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span className="rating-badge" title={ratingText(rating)}>
      {rating ? `${rating}/10` : 'Sin valorar'}
    </span>
  );
}
