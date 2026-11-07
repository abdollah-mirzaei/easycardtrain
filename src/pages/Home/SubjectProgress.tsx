import type { SubjectProgress as SubjectProgressType } from '../../services/stats';

interface SubjectProgressProps {
    subjects: SubjectProgressType[];
}

export function SubjectProgress({ subjects }: SubjectProgressProps) {
    if (subjects.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">پیشرفت درس‌ها</h3>
                <p className="text-gray-500 text-center py-4">
                    هنوز درسی اضافه نکرده‌اید.
                </p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">پیشرفت درس‌ها</h3>

            <div className="space-y-4">
                {subjects.map((subject) => (
                    <div key={subject.subjectId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">{subject.subjectName}</h4>
                            <span className="text-sm text-gray-500">
                                {subject.totalCards} کارت
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-lg font-bold text-red-600">{subject.dueCards}</p>
                                <p className="text-xs text-gray-500">سررسید</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-lg font-bold text-green-600">{subject.reviewedCards}</p>
                                <p className="text-xs text-gray-500">مرورشده</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-lg font-bold text-primary-600">{subject.correctRate}%</p>
                                <p className="text-xs text-gray-500">نرخ صحیح</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
