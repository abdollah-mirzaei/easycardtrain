import { useState } from 'react';
import type { Subject, Chapter, Topic, Flashcard } from '../../types';

export interface FlashcardFormData {
    subjectId: number;
    chapterId: number;
    topicId: number;
    question: string;
    answer: string;
    explanation: string;
    source: string;
}

interface FlashcardFormProps {
    subjects: Subject[];
    chapters: Chapter[];
    topics: Topic[];
    initialData?: Flashcard;
    onSave: (data: FlashcardFormData) => Promise<void>;
    onCancel: () => void;
}

export function FlashcardForm({
    subjects,
    chapters,
    topics,
    initialData,
    onSave,
    onCancel,
}: FlashcardFormProps) {
    const [subjectId, setSubjectId] = useState<number>(initialData?.subjectId ?? 0);
    const [chapterId, setChapterId] = useState<number>(initialData?.chapterId ?? 0);
    const [topicId, setTopicId] = useState<number>(initialData?.topicId ?? 0);
    const [question, setQuestion] = useState(initialData?.question ?? '');
    const [answer, setAnswer] = useState(initialData?.answer ?? '');
    const [explanation, setExplanation] = useState(initialData?.explanation ?? '');
    const [source, setSource] = useState(initialData?.source ?? '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredChapters = chapters.filter((c) => c.subjectId === subjectId);
    const filteredTopics = topics.filter((t) => t.chapterId === chapterId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!subjectId || !chapterId || !topicId) {
            setError('لطفاً درس، فصل و مبحث را انتخاب کنید');
            return;
        }

        if (!question.trim()) {
            setError('لطفاً سؤال را وارد کنید');
            return;
        }

        if (!answer.trim()) {
            setError('لطفاً پاسخ را وارد کنید');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                subjectId,
                chapterId,
                topicId,
                question: question.trim(),
                answer: answer.trim(),
                explanation: explanation.trim(),
                source: source.trim(),
            });
        } catch (err) {
            setError('خطا در ذخیره فلش‌کارت');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-xl font-bold mb-6">
                {initialData ? 'ویرایش فلش‌کارت' : 'ایجاد فلش‌کارت جدید'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {/* انتخاب درس */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        درس
                    </label>
                    <select
                        value={subjectId}
                        onChange={(e) => {
                            setSubjectId(Number(e.target.value));
                            setChapterId(0);
                            setTopicId(0);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value={0}>انتخاب درس...</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* انتخاب فصل */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        فصل
                    </label>
                    <select
                        value={chapterId}
                        onChange={(e) => {
                            setChapterId(Number(e.target.value));
                            setTopicId(0);
                        }}
                        disabled={!subjectId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value={0}>انتخاب فصل...</option>
                        {filteredChapters.map((chapter) => (
                            <option key={chapter.id} value={chapter.id}>
                                {chapter.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* انتخاب مبحث */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        مبحث
                    </label>
                    <select
                        value={topicId}
                        onChange={(e) => setTopicId(Number(e.target.value))}
                        disabled={!chapterId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value={0}>انتخاب مبحث...</option>
                        {filteredTopics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* سؤال */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        سؤال
                    </label>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="سؤال فلش‌کارت را وارد کنید..."
                    />
                </div>

                {/* پاسخ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        پاسخ
                    </label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="پاسخ فلش‌کارت را وارد کنید..."
                    />
                </div>

                {/* توضیحات تکمیلی */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        توضیحات تکمیلی (اختیاری)
                    </label>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="توضیحات تکمیلی برای درک بهتر..."
                    />
                </div>

                {/* منبع */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        منبع یا شماره صفحه (اختیاری)
                    </label>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: کتاب درسی، صفحه ۴۵"
                    />
                </div>

                {/* دکمه‌ها */}
                <div className="flex gap-2 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading ? 'در حال ذخیره...' : initialData ? 'ذخیره تغییرات' : 'ایجاد فلش‌کارت'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}