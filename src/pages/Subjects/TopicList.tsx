import { useState } from 'react';
import type { Chapter, Topic } from '../../types';
import { subjectService } from '../../services/subject';

interface TopicListProps {
    chapter: Chapter;
    topics: Topic[];
    onBack: () => void;
    onRefresh: () => void;
}

export function TopicList({ chapter, topics, onBack, onRefresh }: TopicListProps) {
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            await subjectService.createTopic(newName, chapter.id!);
            setNewName('');
            setShowForm(false);
            onRefresh();
        } catch (err) {
            console.error('Error creating topic:', err);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim() || editingId === null) return;

        try {
            await subjectService.updateTopic(editingId, editName);
            setEditingId(null);
            setEditName('');
            onRefresh();
        } catch (err) {
            console.error('Error updating topic:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('آیا از حذف این مبحث مطمئن هستید؟')) return;

        try {
            await subjectService.deleteTopic(id);
            onRefresh();
        } catch (err) {
            console.error('Error deleting topic:', err);
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
                    >
                        ← بازگشت به فصل‌ها
                    </button>
                    <h3 className="text-xl font-bold">مباحث {chapter.name}</h3>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    + افزودن مبحث
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="نام مبحث را وارد کنید"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        autoFocus
                    />
                    <button type="submit" className="btn-primary">
                        افزودن
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="btn-secondary"
                    >
                        انصراف
                    </button>
                </form>
            )}

            {topics.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    هنوز مبحثی اضافه نکرده‌اید. اولین مبحث را اضافه کنید.
                </p>
            ) : (
                <div className="space-y-3">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                            {editingId === topic.id ? (
                                <form onSubmit={handleUpdate} className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        autoFocus
                                    />
                                    <button type="submit" className="btn-primary">
                                        ذخیره
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="btn-secondary"
                                    >
                                        انصراف
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <span className="flex-1 text-right font-medium">
                                        {topic.name}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(topic.id!);
                                                setEditName(topic.name);
                                            }}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(topic.id!)}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}