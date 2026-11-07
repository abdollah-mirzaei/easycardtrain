import type { DashboardStats } from '../../services/stats';

interface BoxDistributionProps {
    stats: DashboardStats;
}

const BOX_LABELS = ['جعبه ۱', 'جعبه ۲', 'جعبه ۳', 'جعبه ۴', 'جعبه ۵'];
const BOX_COLORS = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'];

export function BoxDistribution({ stats }: BoxDistributionProps) {
    const totalCards = Object.values(stats.boxCounts).reduce((a, b) => a + b, 0);

    if (totalCards === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">توزیع جعبه‌ها</h3>
                <p className="text-gray-500 text-center py-4">
                    هنوز فلش‌کارتی ایجاد نکرده‌اید.
                </p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">توزیع جعبه‌ها</h3>
            <p className="text-sm text-gray-600 mb-4">
                کارت‌های هر جعبه در سیستم لایتنر
            </p>

            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((box) => {
                    const count = stats.boxCounts[box] || 0;
                    const percentage = totalCards > 0 ? (count / totalCards) * 100 : 0;

                    return (
                        <div key={box} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-16">{BOX_LABELS[box - 1]}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                    className={`${BOX_COLORS[box - 1]} h-full rounded-full transition-all flex items-center justify-end pr-2`}
                                    style={{ width: `${Math.max(percentage, 8)}%` }}
                                >
                                    {count > 0 && (
                                        <span className="text-xs font-bold text-white">{count}</span>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 w-12 text-left">
                                {Math.round(percentage)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}