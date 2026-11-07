import { useEffect, useState } from 'react';
import { statsService, type TopicProgress } from '../../services/stats';
import { TopicProgress as TopicProgressComponent } from './TopicProgress';
import { ReviewHistory } from './ReviewHistory';

export function ReportsPage() {
    const [topics, setTopics] = useState<TopicProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const topicProgress = await statsService.getTopicProgress();
                setTopics(topicProgress);
            } catch (err) {
                console.error('Error loading reports data:', err);
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

    return (
        <div className="space-y-6">
            {/* هدر */}
            <div className="card">
                <h2 className="text-2xl font-bold">گزارش‌ها</h2>
                <p className="text-gray-600 mt-1">
                    جزئیات پیشرفت و سابقه مرور شما
                </p>
            </div>

            {/* پیشرفت مباحث */}
            <TopicProgressComponent topics={topics} />

            {/* سابقه مرور */}
            <ReviewHistory />
        </div>
    );
}