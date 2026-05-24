import { Star } from 'lucide-react';

export function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={
                        s <= Math.round(rating)
                            ? 'fill-[#c9a84c] text-[#c9a84c]'
                            : 'fill-transparent text-gray-300'
                    }
                />
            ))}
        </div>
    );
}

export function RatingDisplay({ rating, count }: { rating: number; count?: number }) {
    return (
        <div className="flex items-center gap-1.5">
            <StarDisplay rating={rating} size={14} />
            {count !== undefined && (
                <span className="text-on-surface-variant/60 text-[11px]">
                    ({count} {count === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
}
