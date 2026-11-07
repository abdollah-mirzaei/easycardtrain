import { useState } from 'react';
import type { Subject } from '../../types';
import { subjectService } from '../../services/subject';

interface SubjectListProps {
    subjects: Subject[];
    onSelectSubject: (subject: Subject) => void;
    onRefresh: () => void;
}

export function SubjectList({ subjects, onSelectSubject, onRefresh }: SubjectListProps) {
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            // فرض می‌کنیم پروفایل با آیدی ۱ وجود دارد
            await subjectService.createSubject(newName, 1);
            setNewName('');
            setShowForm(false);
            onRefresh();
        } catch (err) {
            console.error('Error creating subject:', err);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim() || editingId === null) return;

        try {
            await subjectService.updateSubject(editingId, editName);
            setEditingId(null);
            setEditName('');
            onRefresh();
        } catch (err) {
            console.error('Error updating subject:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('آیا از حذف این درس مطمئن هستید؟')) return;

        try {
            await subjectService.deleteSubject(id);
            onRefresh();
        } catch (err) {
            console.error('Error deleting subject:', err);
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">درس‌ها</h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    + افزودن درس
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="نام درس را وارد کنید"
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

            {subjects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    هنوز درسی اضافه نکرده‌اید. اولین درس خود را اضافه کنید.
                </p>
            ) : (
                <div className="space-y-3">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                        >
                            {editingId === subject.id ? (
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
                                    <button
                                        onClick={() => onSelectSubject(subject)}
                                        className="flex-1 text-right font-medium hover:text-primary-600"
                                    >
                                        {subject.name}
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(subject.id!);
                                                setEditName(subject.name);
                                            }}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(subject.id!)}
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