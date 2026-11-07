import { useState } from 'react';
import type { Flashcard } from '../../types';
import { ReviewRating } from '../../types';
import { formatInterval } from '../../services/leitner';
import { getBoxInterval } from '../../services/leitner';

interface ReviewCardProps {
    card: Flashcard;
    onRating: (rating: ReviewRating) => void;
}

export function ReviewCard({ card, onRating }: ReviewCardProps) {
    const [showAnswer, setShowAnswer] = useState(false);

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    if (!showAnswer) {
        return (
            <div className="card">
                <div className="text-center mb-6">
                    <span className="inline-block bg-primary-50 text-primary-600 text-sm px-3 py-1 rounded-full mb-4">
                        جعبه {card.boxNumber}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-8 text-center">
                    {card.question}
                </h3>

                <div className="text-center">
                    <button onClick={handleShowAnswer} className="btn-primary">
                        نمایش پاسخ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="text-center mb-6">
                <span className="inline-block bg-primary-50 text-primary-600 text-sm px-3 py-1 rounded-full mb-4">
                    جعبه {card.boxNumber}
                </span>
            </div>

            {/* سؤال */}
            <h3 className="text-xl font-bold mb-4">{card.question}</h3>

            {/* پاسخ */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-900">{card.answer}</p>
            </div>

            {/* توضیحات */}
            {card.explanation && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">💡 {card.explanation}</p>
                </div>
            )}

            {/* منبع */}
            {card.source && (
                <p className="text-gray-500 text-sm mb-6">📖 {card.source}</p>
            )}

            {/* ارزیابی */}
            <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-4">
                    چقدر این پاسخ را به خاطر داشتید؟
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onRating(ReviewRating.FORGOT)}
                        className="flex flex-col items-center p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <span className="text-2xl mb-2">😵</span>
                        <span className="font-medium text-red-600">بلد نبودم</span>
                        <span className="text-xs text-gray-500 mt-1">
                            ۱۰ دقیقه دیگر
                        </span>
                    </button>

                    <button
                        onClick={() => onRating(ReviewRating.HARD)}
                        className="flex flex-col items-center p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        <span className="text-2xl mb-2">😰</span>
                        <span className="font-medium text-orange-600">سخت بود</span>
                        <span className="text-xs text-gray-500 mt-1">
                            {formatInterval(getBoxInterval(card.boxNumber) * 0.5)}
                        </span>
                    </button>

                    <button
                        onClick={() => onRating(ReviewRating.GOOD)}
                        className="flex flex-col items-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        <span className="text-2xl mb-2">😊</span>
                        <span className="font-medium text-green-600">خوب بود</span>
                        <span className="text-xs text-gray-500 mt-1">
                            {card.boxNumber < 5 ? formatInterval(getBoxInterval(card.boxNumber + 1)) : 'مسلط'}
                        </span>
                    </button>

                    <button
                        onClick={() => onRating(ReviewRating.PERFECT)}
                        className="flex flex-col items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-2xl mb-2">🤩</span>
                        <span className="font-medium text-blue-600">کاملاً مسلط</span>
                        <span className="text-xs text-gray-500 mt-1">
                            {card.boxNumber < 4 ? formatInterval(getBoxInterval(Math.min(card.boxNumber + 2, 5))) : 'مسلط'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}