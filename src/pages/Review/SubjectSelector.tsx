import type { SubjectDueInfo } from '../../services/review';

interface SubjectSelectorProps {
    subjects: SubjectDueInfo[];
    onSelect: (subjectId: number) => void;
}

export function SubjectSelector({ subjects, onSelect }: SubjectSelectorProps) {
    const totalDue = subjects.reduce((sum, s) => sum + s.dueCount, 0);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <h2 className="text-2xl font-bold mb-2">شروع مرور</h2>
                <p className="text-gray-600 mb-6">
                    {totalDue} کارت سررسید شده در {subjects.length} درس وجود دارد.
                    کدام درس را مرور می‌کنید؟
                </p>

                <div className="space-y-3">
                    {subjects.map((subject) => (
                        <button
                            key={subject.subjectId}
                            onClick={() => onSelect(subject.subjectId)}
                            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-right"
                        >
                            <span className="font-medium text-lg">{subject.subjectName}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {subject.dueCount} کارت
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}