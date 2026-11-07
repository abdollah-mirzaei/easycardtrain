import { useEffect, useState } from 'react';
import { studentService } from '../../services/student';
import { subjectService } from '../../services/subject';
import type { Student, Subject, Chapter, Topic } from '../../types';
import { FIELD_LABELS, GRADE_LABELS } from '../../types';
import { SubjectList } from './SubjectList';
import { ChapterList } from './ChapterList';
import { TopicList } from './TopicList';

export function SubjectsPage() {
    const [student, setStudent] = useState<Student | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const profile = await studentService.getProfile();
            if (profile) {
                setStudent(profile);
                const subs = await subjectService.getSubjectsByStudent(profile.id!);
                setSubjects(subs);

                const chaps = await subjectService.getChapters();
                setChapters(chaps);

                const tps = await subjectService.getTopics();
                setTopics(tps);
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="card text-center">
                <h2 className="text-2xl font-bold mb-4">ابتدا پروفایل خود را ایجاد کنید</h2>
                <a href="/profile/create" className="btn-primary inline-block">
                    ایجاد پروفایل
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* هدر با اطلاعات پروفایل */}
            <div className="card">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">درس‌های من</h2>
                        <p className="text-gray-600 mt-1">
                            {student.name} • {FIELD_LABELS[student.field]} • {GRADE_LABELS[student.grade]}
                        </p>
                    </div>
                </div>
            </div>

            {/* انتخاب حالت نمایش */}
            {!selectedSubject && (
                <SubjectList
                    subjects={subjects}
                    onSelectSubject={setSelectedSubject}
                    onRefresh={loadData}
                />
            )}

            {selectedSubject && !selectedChapter && (
                <ChapterList
                    subject={selectedSubject}
                    chapters={chapters.filter(c => c.subjectId === selectedSubject.id)}
                    onSelectChapter={setSelectedChapter}
                    onBack={() => setSelectedSubject(null)}
                    onRefresh={loadData}
                />
            )}

            {selectedSubject && selectedChapter && (
                <TopicList
                    chapter={selectedChapter}
                    topics={topics.filter(t => t.chapterId === selectedChapter.id)}
                    onBack={() => setSelectedChapter(null)}
                    onRefresh={loadData}
                />
            )}
        </div>
    );
}