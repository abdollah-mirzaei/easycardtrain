import type { TopicProgress as TopicProgressType } from '../../services/stats';

interface TopicProgressProps {
    topics: TopicProgressType[];
}

export function TopicProgress({ topics }: TopicProgressProps) {
    if (topics.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">پیشرفت مباحث</h3>
                <p className="text-gray-500 text-center py-4">
                    هنوز مبحثی اضافه نکرده‌اید.
                </p>
            </div>
        );
    }

    // مرتب‌سازی بر اساس تعداد کارت‌های سررسید (نیاز به تمرین بیشتر)
    const sortedTopics = [...topics].sort((a, b) => b.dueCards - a.dueCards);

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">پیشرفت مباحث</h3>
            <p className="text-sm text-gray-600 mb-4">
                مباحث با کارت‌های سررسید بیشتر در بالا نمایش داده می‌شوند
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-right py-3 px-2 font-medium text-gray-600">مبحث</th>
                            <th className="text-right py-3 px-2 font-medium text-gray-600">درس</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-600">کارت‌ها</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-600">سررسید</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-600">نرخ صحیح</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTopics.map((topic) => (
                            <tr key={topic.topicId} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div>
                                        <p className="font-medium">{topic.topicName}</p>
                                        <p className="text-xs text-gray-500">{topic.chapterName}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-gray-600">{topic.subjectName}</td>
                                <td className="py-3 px-2 text-center">{topic.totalCards}</td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs ${topic.dueCards > 0
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                        {topic.dueCards}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs ${topic.correctRate >= 70
                                            ? 'bg-green-100 text-green-700'
                                            : topic.correctRate >= 40
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                        {topic.correctRate}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}