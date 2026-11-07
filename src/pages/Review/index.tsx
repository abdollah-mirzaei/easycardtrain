import { useEffect, useState } from 'react';
import { reviewService, type SubjectDueInfo } from '../../services/review';
import { SubjectSelector } from './SubjectSelector';
import { ReviewSession } from './ReviewSession';
import { SessionComplete } from './SessionComplete';

type ReviewState = 'loading' | 'select-subject' | 'session' | 'complete';

export function ReviewPage() {
    const [state, setState] = useState<ReviewState>('loading');
    const [dueSubjects, setDueSubjects] = useState<SubjectDueInfo[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [sessionStats, setSessionStats] = useState({ total: 0, correct: 0, wrong: 0 });

    const loadDueSubjects = async () => {
        const subjects = await reviewService.getDueCardsBySubject();
        setDueSubjects(subjects);

        if (subjects.length === 0) {
            setState('complete');
        } else if (subjects.length === 1) {
            // اگر فقط یک درس وجود دارد، مستقیماً وارد جلسه شوید
            setSelectedSubjectId(subjects[0].subjectId);
            setState('session');
        } else {
            setState('select-subject');
        }
    };

    useEffect(() => {
        loadDueSubjects();
    }, []);

    const handleSessionComplete = async () => {
        const stats = await reviewService.getSessionStats();
        setSessionStats(stats);
        setState('complete');
    };

    if (state === 'loading') {
        return (
            <div className="card">
                <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
        );
    }

    if (state === 'select-subject') {
        return (
            <SubjectSelector
                subjects={dueSubjects}
                onSelect={(subjectId) => {
                    setSelectedSubjectId(subjectId);
                    setState('session');
                }}
            />
        );
    }

    if (state === 'session' && selectedSubjectId) {
        return (
            <ReviewSession
                subjectId={selectedSubjectId}
                onComplete={handleSessionComplete}
                onExit={() => setState('select-subject')}
            />
        );
    }

    if (state === 'complete') {
        return (
            <SessionComplete
                stats={sessionStats}
                hasMoreCards={dueSubjects.length > 0}
                onStartNew={() => {
                    setState('loading');
                    loadDueSubjects();
                }}
            />
        );
    }

    return null;
}