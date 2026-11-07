import { useEffect, useState } from 'react';
import { statsService, type DashboardStats, type SubjectProgress, type RecentReview } from '../../services/stats';
import { StatsCards } from './StatsCards';
import { BoxDistribution } from './BoxDistribution';
import { SubjectProgress as SubjectProgressComponent } from './SubjectProgress';
import { RecentReviews } from './RecentReviews';

export function HomePage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [subjects, setSubjects] = useState<SubjectProgress[]>([]);
    const [reviews, setReviews] = useState<RecentReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardStats = await statsService.getDashboardStats();
                setStats(dashboardStats);

                const subjectProgress = await statsService.getSubjectProgress();
                setSubjects(subjectProgress);

                const recentReviews = await statsService.getRecentReviews(5);
                setReviews(recentReviews);
            } catch (err) {
                console.error('Error loading dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="card">
                <p className="text-gray-600">خطا در بارگذاری داده‌ها</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* هدر */}
            <div className="card">
                <h2 className="text-2xl font-bold">خانه</h2>
                <p className="text-gray-600 mt-1">
                    وضعیت یادگیری شما در یک نگاه
                </p>
            </div>

            {/* کارت‌های آمار */}
            <StatsCards stats={stats} />

            {/* دکمه شروع مرور */}
            {stats.dueCards > 0 && (
                <div className="card bg-primary-50 border-primary-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-primary-900">
                                📚 {stats.dueCards} کارت برای مرور دارید
                            </h3>
                            <p className="text-primary-700 text-sm mt-1">
                                همین الان شروع کنید و یادگیری خود را تقویت کنید
                            </p>
                        </div>
                        <a href="/review" className="btn-primary">
                            شروع مرور
                        </a>
                    </div>
                </div>
            )}

            {/* نمودار جعبه‌ها و پیشرفت درس‌ها */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BoxDistribution stats={stats} />
                <SubjectProgressComponent subjects={subjects} />
            </div>

            {/* آخرین مرورها */}
            <RecentReviews reviews={reviews} />
        </div>
    );
}