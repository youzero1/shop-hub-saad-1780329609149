import { Star } from 'lucide-react';

type StarRatingProps = { rating: number; max?: number };

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className="w-4 h-4"
            fill={filled ? '#f59e0b' : half ? '#f59e0b80' : 'none'}
            stroke={filled || half ? '#f59e0b' : '#d1d5db'}
          />
        );
      })}
    </div>
  );
}
