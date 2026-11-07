import type { DashboardStats } from '../../services/stats';

interface StatsCardsProps {
    stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* کارت‌های سررسید */}
            <div className="card bg-primary-50 border-primary-200">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">📚</span>
                    <div>
                        <p className="text-2xl font-bold text-primary-600">{stats.dueCards}</p>
                        <p className="text-sm text-gray-600">کارت سررسید</p>
                    </div>
                </div>
            </div>

            {/* مرورشده امروز */}
            <div className="card bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <div>
                        <p className="text-2xl font-bold text-green-600">{stats.reviewedToday}</p>
                        <p className="text-sm text-gray-600">مرور امروز</p>
                    </div>
                </div>
            </div>

            {/* نرخ موفقیت */}
            <div className="card bg-purple-50 border-purple-200">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <div>
                        <p className="text-2xl font-bold text-purple-600">{stats.successRateToday}%</p>
                        <p className="text-sm text-gray-600">نرخ موفقیت امروز</p>
                    </div>
                </div>
            </div>

            {/* کل کارت‌ها */}
            <div className="card bg-gray-50 border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎴</span>
                    <div>
                        <p className="text-2xl font-bold text-gray-600">{stats.totalCards}</p>
                        <p className="text-sm text-gray-600">کل فلش‌کارت‌ها</p>
                    </div>
                </div>
            </div>
        </div>
    );
}