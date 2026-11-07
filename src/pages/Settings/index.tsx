import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db';
import { studentService } from '../../services/student';
import type { Student } from '../../types';
import { FIELD_LABELS, GRADE_LABELS } from '../../types';

export function SettingsPage() {
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await studentService.getProfile();
            setStudent(profile ?? null);
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleClearAllData = async () => {
        setDeleting(true);
        try {
            // پاک کردن تمام جداول به ترتیب
            await db.reviewLogs.clear();
            await db.flashcards.clear();
            await db.topics.clear();
            await db.chapters.clear();
            await db.subjects.clear();
            await db.students.clear();

            setShowDeleteConfirm(false);
            alert('تمام داده‌ها با موفقیت پاک شدند.');
            navigate('/profile/create');
        } catch (error) {
            console.error('Error clearing data:', error);
            alert('خطا در پاک کردن داده‌ها. لطفاً دوباره تلاش کنید.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* هدر */}
            <div className="card">
                <h2 className="text-2xl font-bold">تنظیمات</h2>
                <p className="text-gray-600 mt-1">
                    مدیریت پروفایل و داده‌های برنامه
                </p>
            </div>

            {/* اطلاعات پروفایل */}
            {student && (
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">اطلاعات پروفایل</h3>
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="btn-secondary text-sm"
                        >
                            ویرایش
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">نام:</span>
                            <span className="font-medium">{student.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">رشته تحصیلی:</span>
                            <span className="font-medium">{FIELD_LABELS[student.field]}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">پایه تحصیلی:</span>
                            <span className="font-medium">{GRADE_LABELS[student.grade]}</span>
                        </div>
                    </div>
                </div>
            )}

            {!student && (
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">اطلاعات پروفایل</h3>
                    <p className="text-gray-600 mb-4">
                        هنوز پروفایلی ایجاد نکرده‌اید.
                    </p>
                    <button
                        onClick={() => navigate('/profile/create')}
                        className="btn-primary"
                    >
                        ایجاد پروفایل
                    </button>
                </div>
            )}

            {/* مدیریت داده‌ها */}
            <div className="card">
                <h3 className="text-lg font-bold mb-4">مدیریت داده‌ها</h3>
                <p className="text-gray-600 mb-4">
                    تمام داده‌های شما (پروفایل، درس‌ها، فلش‌کارت‌ها و سابقه مرور) به‌صورت محلی در مرورگر شما ذخیره می‌شوند.
                </p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                    >
                        پاک کردن تمام داده‌ها
                    </button>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium mb-3">
                            ⚠️ آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است!
                        </p>
                        <p className="text-red-700 text-sm mb-4">
                            تمام پروفایل، درس‌ها، فلش‌کارت‌ها و سابقه مرور شما برای همیشه حذف خواهند شد.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClearAllData}
                                disabled={deleting}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'در حال پاک کردن...' : 'بله، پاک کن'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="btn-secondary"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* درباره برنامه */}
            <div className="card">
                <h3 className="text-lg font-bold mb-4">درباره EasyCardTrain</h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">نسخه:</span>
                        <span className="font-medium">1.0.0 (MVP)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">نوع برنامه:</span>
                        <span className="font-medium">PWA (Progressive Web App)</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">ذخیره‌سازی:</span>
                        <span className="font-medium">محلی (IndexedDB)</span>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        EasyCardTrain یک دستیار هوشمند مرور است که بر پایه اصول علمی یادگیری شامل
                        <strong> مرور فاصله‌دار (Spaced Repetition)</strong>،
                        <strong> بازیابی فعال (Active Recall)</strong> و
                        <strong> یادگیری تطبیقی (Adaptive Learning)</strong> ساخته شده است.
                    </p>
                </div>
            </div>

            {/* لینک‌های مفید */}
            <div className="card">
                <h3 className="text-lg font-bold mb-4">لینک‌های مفید</h3>

                <div className="space-y-2">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                        <span className="text-2xl">💻</span>
                        <div className="flex-1">
                            <p className="font-medium">مخزن پروژه</p>
                            <p className="text-sm text-gray-500">کد منبع در GitHub</p>
                        </div>
                        <span className="text-gray-400">←</span>
                    </a>

                    <a
                        href="https://fa.wikipedia.org/wiki/%D9%85%D8%B1%D9%88%D8%B1_%D9%81%D8%A7%D8%B5%D9%84%D9%87%E2%80%8C%D8%AF%D8%A7%D8%B1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                        <span className="text-2xl">📚</span>
                        <div className="flex-1">
                            <p className="font-medium">درباره مرور فاصله‌دار</p>
                            <p className="text-sm text-gray-500">مقاله ویکی‌پدیا</p>
                        </div>
                        <span className="text-gray-400">←</span>
                    </a>

                    <a
                        href="mailto:support@example.com"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                        <span className="text-2xl">📧</span>
                        <div className="flex-1">
                            <p className="font-medium">تماس با ما</p>
                            <p className="text-sm text-gray-500">پیشنهادات و گزارش مشکلات</p>
                        </div>
                        <span className="text-gray-400">←</span>
                    </a>
                </div>
            </div>

            {/* فوتر */}
            <div className="text-center text-sm text-gray-500 py-4">
                <p>ساخته شده با ❤️ برای دانش‌آموزان ایرانی</p>
                <p className="mt-1">نسخه 1.0.0 — 2026</p>
            </div>
        </div>
    );
}