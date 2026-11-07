import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student';
import type { Student } from '../../types';
import { FIELD_LABELS, GRADE_LABELS } from '../../types';

export function ProfilePage() {
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await studentService.getProfile();
            if (profile) {
                setStudent(profile);
            } else {
                navigate('/profile/create');
            }
            setLoading(false);
        };
        loadProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    if (!student) {
        return null;
    }

    return (
        <div className="card">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">پروفایل دانش‌آموز</h2>
                    <p className="text-gray-600">اطلاعات پروفایل شما</p>
                </div>
                <button
                    onClick={() => navigate('/profile/edit')}
                    className="btn-primary"
                >
                    ویرایش پروفایل
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">نام:</span>
                    <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">رشته تحصیلی:</span>
                    <span className="font-medium">{FIELD_LABELS[student.field]}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">پایه تحصیلی:</span>
                    <span className="font-medium">{GRADE_LABELS[student.grade]}</span>
                </div>
                <div className="flex justify-between py-3">
                    <span className="text-gray-600">تاریخ ایجاد:</span>
                    <span className="font-medium">
                        {new Date(student.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                </div>
            </div>
        </div>
    );
}