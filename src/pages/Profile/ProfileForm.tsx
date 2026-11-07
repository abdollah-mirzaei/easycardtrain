import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student';
import type { Field, Grade } from '../../types';
import { FIELD_LABELS, GRADE_LABELS } from '../../types';

export function ProfileForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [field, setField] = useState<Field>('math');
    const [grade, setGrade] = useState<Grade>('grade10');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('لطفاً نام خود را وارد کنید');
            return;
        }

        setLoading(true);
        try {
            await studentService.createProfile({ name, field, grade });
            navigate('/subjects');
        } catch (err) {
            setError('خطا در ایجاد پروفایل');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="card">
                <h2 className="text-2xl font-bold mb-2">ایجاد پروفایل</h2>
                <p className="text-gray-600 mb-6">
                    اطلاعات خود را برای شروع یادگیری وارد کنید
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            نام و نام خانوادگی
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="مثال: علی محمدی"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            رشته تحصیلی
                        </label>
                        <select
                            value={field}
                            onChange={(e) => setField(e.target.value as Field)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {Object.entries(FIELD_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            پایه تحصیلی
                        </label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value as Grade)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {Object.entries(GRADE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50"
                    >
                        {loading ? 'در حال ایجاد...' : 'ایجاد پروفایل'}
                    </button>
                </form>
            </div>
        </div>
    );
}