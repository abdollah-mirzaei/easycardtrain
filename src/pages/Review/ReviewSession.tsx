import { useEffect, useState } from 'react';
import { reviewService, type DueCardInfo } from '../../services/review';
import { ReviewRating } from '../../types';
import { ReviewCard } from './ReviewCard';

interface ReviewSessionProps {
    subjectId: number;
    onComplete: () => void;
    onExit: () => void;
}

export function ReviewSession({ subjectId, onComplete, onExit }: ReviewSessionProps) {
    const [cards, setCards] = useState<DueCardInfo[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        const loadCards = async () => {
            const dueCards = await reviewService.getDueCardsForSubject(subjectId);
            setCards(dueCards);
            setLoading(false);
        };
        loadCards();
    }, [subjectId]);

    const handleRating = async (rating: ReviewRating) => {
        const currentCard = cards[currentIndex];

        await reviewService.submitReview(currentCard.flashcard, rating);

        const isCorrect = rating === ReviewRating.GOOD || rating === ReviewRating.PERFECT;
        setAnsweredCount(answeredCount + 1);
        if (isCorrect) {
            setCorrectCount(correctCount + 1);
        }

        if (currentIndex + 1 < cards.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    if (loading) {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="card text-center">
                <h2 className="text-2xl font-bold mb-4">کارت سررسید وجود ندارد</h2>
                <p className="text-gray-600 mb-6">
                    همه کارت‌های این درس مرور شده‌اند. بعداً دوباره سر بزنید.
                </p>
                <button onClick={onExit} className="btn-primary">
                    بازگشت
                </button>
            </div>
        );
    }

    const currentCard = cards[currentIndex];
    const progress = Math.round((answeredCount / cards.length) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* هدر جلسه */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold">{currentCard.subjectName}</h2>
                        <p className="text-gray-600 text-sm">
                            {currentCard.chapterName} • {currentCard.topicName}
                        </p>
                    </div>
                    <button
                        onClick={onExit}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        خروج از جلسه
                    </button>
                </div>

                {/* نوار پیشرفت */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    کارت {currentIndex + 1} از {cards.length}
                </p>
            </div>

            {/* کارت مرور */}
            <ReviewCard card={currentCard.flashcard} onRating={handleRating} />
        </div>
    );
}