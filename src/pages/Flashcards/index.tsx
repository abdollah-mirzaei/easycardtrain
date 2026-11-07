import { useEffect, useState } from 'react';
import { studentService } from '../../services/student';
import { subjectService } from '../../services/subject';
import { flashcardService } from '../../services/flashcard';
import type { Flashcard, Subject, Chapter, Topic } from '../../types';
import { FlashcardForm, type FlashcardFormData } from './FlashcardForm';

export function FlashcardsPage() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    // فیلترها
    const [filterSubjectId, setFilterSubjectId] = useState<number>(0);
    const [filterChapterId, setFilterChapterId] = useState<number>(0);
    const [filterTopicId, setFilterTopicId] = useState<number>(0);
    const [search, setSearch] = useState('');

    // حالت نمایش فرم
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const profile = await studentService.getProfile();
            if (profile) {
                const subs = await subjectService.getSubjectsByStudent(profile.id!);
                setSubjects(subs);

                const chaps = await subjectService.getChapters();
                setChapters(chaps);

                const tps = await subjectService.getTopics();
                setTopics(tps);

                const cards = await flashcardService.getFiltered({
                    subjectId: filterSubjectId || undefined,
                    chapterId: filterChapterId || undefined,
                    topicId: filterTopicId || undefined,
                    search: search || undefined,
                });
                setFlashcards(cards);
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filterSubjectId, filterChapterId, filterTopicId, search]);

    const handleSave = async (data: FlashcardFormData) => {
        if (editingCard?.id) {
            await flashcardService.update(editingCard.id, data);
        } else {
            await flashcardService.create(data);
        }
        setShowForm(false);
        setEditingCard(null);
        await loadData();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('آیا از حذف این فلش‌کارت مطمئن هستید؟')) return;

        try {
            await flashcardService.delete(id);
            await loadData();
        } catch (err) {
            console.error('Error deleting flashcard:', err);
        }
    };

    const filteredChapters = chapters.filter((c) => c.subjectId === filterSubjectId);
    const filteredTopics = topics.filter((t) => t.chapterId === filterChapterId);

    const getSubjectName = (id: number) => subjects.find((s) => s.id === id)?.name ?? 'نامشخص';
    const getChapterName = (id: number) => chapters.find((c) => c.id === id)?.name ?? 'نامشخص';
    const getTopicName = (id: number) => topics.find((t) => t.id === id)?.name ?? 'نامشخص';

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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">مدیریت فلش‌کارت‌ها</h2>
                        <p className="text-gray-600 mt-1">
                            {flashcards.length} فلش‌کارت
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCard(null);
                            setShowForm(true);
                        }}
                        className="btn-primary"
                    >
                        + ایجاد فلش‌کارت
                    </button>
                </div>
            </div>

            {/* فرم ایجاد/ویرایش */}
            {showForm && (
                <FlashcardForm
                    subjects={subjects}
                    chapters={chapters}
                    topics={topics}
                    initialData={editingCard ?? undefined}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingCard(null);
                    }}
                />
            )}

            {/* فیلترها و جست‌وجو */}
            <div className="card">
                <h3 className="text-lg font-bold mb-4">جست‌وجو و فیلتر</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جست‌وجو در سؤال و پاسخ..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <select
                        value={filterSubjectId}
                        onChange={(e) => {
                            setFilterSubjectId(Number(e.target.value));
                            setFilterChapterId(0);
                            setFilterTopicId(0);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value={0}>همه درس‌ها</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterChapterId}
                        onChange={(e) => {
                            setFilterChapterId(Number(e.target.value));
                            setFilterTopicId(0);
                        }}
                        disabled={!filterSubjectId}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value={0}>همه فصل‌ها</option>
                        {filteredChapters.map((chapter) => (
                            <option key={chapter.id} value={chapter.id}>
                                {chapter.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterTopicId}
                        onChange={(e) => setFilterTopicId(Number(e.target.value))}
                        disabled={!filterChapterId}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value={0}>همه مباحث</option>
                        {filteredTopics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* لیست فلش‌کارت‌ها */}
            <div className="card">
                {flashcards.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        {subjects.length === 0
                            ? 'ابتدا درس، فصل و مبحث خود را در بخش "درس‌های من" ایجاد کنید.'
                            : 'هنوز فلش‌کارتی ایجاد نکرده‌اید. اولین فلش‌کارت خود را بسازید.'}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {flashcards.map((card) => (
                            <div
                                key={card.id}
                                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 mb-2">
                                            {card.question}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {card.answer}
                                        </p>
                                        {card.explanation && (
                                            <p className="text-gray-500 text-sm mb-2">
                                                💡 {card.explanation}
                                            </p>
                                        )}
                                        {card.source && (
                                            <p className="text-gray-400 text-xs">
                                                📖 {card.source}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mr-4">
                                        <button
                                            onClick={() => {
                                                setEditingCard(card);
                                                setShowForm(true);
                                            }}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(card.id!)}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                        {getSubjectName(card.subjectId)}
                                    </span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                        {getChapterName(card.chapterId)}
                                    </span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                        {getTopicName(card.topicId)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}