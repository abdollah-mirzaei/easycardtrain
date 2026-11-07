import type { RecentReview } from '../../services/stats';

interface RecentReviewsProps {
    reviews: RecentReview[];
}

const RATING_LABELS: Record<string, string> = {
    forgot: 'بلد نبودم',
    hard: 'سخت بود',
    good: 'خوب بود',
    perfect: 'کاملاً مسلط',
};

const RATING_COLORS: Record<string, string> = {
    forgot: 'bg-red-100 text-red-700',
    hard: 'bg-orange-100 text-orange-700',
    good: 'bg-green-100 text-green-700',
    perfect: 'bg-blue-100 text-blue-700',
};

export function RecentReviews({ reviews }: RecentReviewsProps) {
    if (reviews.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">آخرین مرورها</h3>
                <p className="text-gray-500 text-center py-4">
                    هنوز مروری انجام ندهید.
                </p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">آخرین مرورها</h3>

            <div className="space-y-3">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                    >
                        <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 mb-1">
                                {review.question}
                            </p>
                            <p className="text-xs text-gray-500">
                                {review.subjectName} •{' '}
                                {new Date(review.reviewedAt).toLocaleDateString('fa-IR')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                جعبه {review.boxBefore} → {review.boxAfter}
                            </span>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${RATING_COLORS[review.rating]}`}
                            >
                                {RATING_LABELS[review.rating]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}