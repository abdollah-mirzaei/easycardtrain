interface SessionCompleteProps {
    stats: {
        total: number;
        correct: number;
        wrong: number;
    };
    hasMoreCards: boolean;
    onStartNew: () => void;
}

export function SessionComplete({ stats, hasMoreCards, onStartNew }: SessionCompleteProps) {
    const successRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    return (
        <div className="max-w-md mx-auto">
            <div className="card text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">جلسه مرور تمام شد!</h2>
                <p className="text-gray-600 mb-6">
                    آفرین! مرور امروز شما کامل شد.
                </p>

                {/* آمار */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-600">کل مرورها</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
                        <p className="text-sm text-gray-600">صحیح</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-red-600">{stats.wrong}</p>
                        <p className="text-sm text-gray-600">اشتباه</p>
                    </div>
                </div>

                {/* نرخ موفقیت */}
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">نرخ پاسخ صحیح</p>
                    <p className="text-3xl font-bold text-primary-600">{successRate}%</p>
                </div>

                {/* دکمه‌ها */}
                <div className="space-y-3">
                    {hasMoreCards && (
                        <button onClick={onStartNew} className="w-full btn-primary">
                            مرور درس دیگر
                        </button>
                    )}
                    <a href="/" className="block w-full btn-secondary text-center">
                        بازگشت به خانه
                    </a>
                </div>
            </div>
        </div>
    );
}