import { useEffect, useState } from 'react';
import { statsService } from '../../services/stats';
import type { ReviewLog } from '../../types';

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

export function ReviewHistory() {
    const [logs, setLogs] = useState<ReviewLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await statsService.getReviewHistory();
                setLogs(history.slice(0, 50)); // فقط ۵۰ مورد آخر
            } catch (err) {
                console.error('Error loading review history:', err);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">سابقه مرور</h3>
                <p className="text-gray-500 text-center py-4">
                    هنوز مروری انجام ندهید.
                </p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">سابقه مرور</h3>
            <p className="text-sm text-gray-600 mb-4">
                {logs.length} مرور اخیر
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                    <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                    >
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">
                                جعبه {log.boxBefore} → {log.boxAfter}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(log.reviewedAt).toLocaleDateString('fa-IR')}{' '}
                                {new Date(log.reviewedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${RATING_COLORS[log.rating]}`}
                        >
                            {RATING_LABELS[log.rating]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}