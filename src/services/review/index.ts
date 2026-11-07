import { db } from '../../db';
import type { Flashcard, ReviewRating } from '../../types';
import { calculateNextReview } from '../leitner';
import type { ReviewResult } from '../leitner';
import { DEFAULT_CONFIG } from '../leitner';

export interface DueCardInfo {
    flashcard: Flashcard;
    subjectName: string;
    chapterName: string;
    topicName: string;
}

export interface SubjectDueInfo {
    subjectId: number;
    subjectName: string;
    dueCount: number;
}

export const reviewService = {
    /**
     * دریافت کارت‌های سررسید به تفکیک درس
     */
    async getDueCardsBySubject(): Promise<SubjectDueInfo[]> {
        const dueCards = await db.flashcards
            .where('nextReviewAt')
            .belowOrEqual(new Date())
            .toArray();

        if (dueCards.length === 0) {
            return [];
        }

        // گروه‌بندی بر اساس درس
        const bySubject = new Map<number, number>();
        for (const card of dueCards) {
            const count = bySubject.get(card.subjectId) || 0;
            bySubject.set(card.subjectId, count + 1);
        }

        // دریافت نام درس‌ها
        const subjects = await db.subjects.toArray();
        const result: SubjectDueInfo[] = [];

        for (const [subjectId, count] of bySubject) {
            const subject = subjects.find((s) => s.id === subjectId);
            if (subject) {
                result.push({
                    subjectId,
                    subjectName: subject.name,
                    dueCount: count,
                });
            }
        }

        return result.sort((a, b) => b.dueCount - a.dueCount);
    },

    /**
     * دریافت کارت‌های سررسید یک درس خاص
     */
    async getDueCardsForSubject(subjectId: number): Promise<DueCardInfo[]> {
        const dueCards = await db.flashcards
            .where('subjectId')
            .equals(subjectId)
            .filter((card) => card.nextReviewAt <= new Date())
            .toArray();

        // دریافت اطلاعات مرتبط
        const subjects = await db.subjects.toArray();
        const chapters = await db.chapters.toArray();
        const topics = await db.topics.toArray();

        return dueCards.map((card) => ({
            flashcard: card,
            subjectName: subjects.find((s) => s.id === card.subjectId)?.name ?? 'نامشخص',
            chapterName: chapters.find((c) => c.id === card.chapterId)?.name ?? 'نامشخص',
            topicName: topics.find((t) => t.id === card.topicId)?.name ?? 'نامشخص',
        }));
    },

    /**
     * ثبت ارزیابی و به‌روزرسانی کارت
     */
    async submitReview(
        flashcard: Flashcard,
        rating: ReviewRating
    ): Promise<ReviewResult> {
        const now = new Date();

        // محاسبه مرور بعدی
        const result = calculateNextReview(
            flashcard.boxNumber,
            rating,
            DEFAULT_CONFIG,
            now
        );

        // به‌روزرسانی کارت
        await db.flashcards.update(flashcard.id!, {
            boxNumber: result.boxNumber,
            status: result.status,
            lastReviewAt: now,
            nextReviewAt: result.nextReviewAt,
            reviewCount: flashcard.reviewCount + 1,
            correctCount: flashcard.correctCount + (rating === 'good' || rating === 'perfect' ? 1 : 0),
            wrongCount: flashcard.wrongCount + (rating === 'forgot' || rating === 'hard' ? 1 : 0),
            updatedAt: now,
        });

        // ذخیره سابقه ارزیابی
        await db.reviewLogs.add({
            flashcardId: flashcard.id!,
            rating,
            boxBefore: flashcard.boxNumber,
            boxAfter: result.boxNumber,
            reviewedAt: now,
        });

        return result;
    },

    /**
     * دریافت آمار جلسه
     */
    async getSessionStats(): Promise<{
        total: number;
        correct: number;
        wrong: number;
    }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const logs = await db.reviewLogs
            .where('reviewedAt')
            .aboveOrEqual(today)
            .toArray();

        const correct = logs.filter(
            (l) => l.rating === 'good' || l.rating === 'perfect'
        ).length;

        return {
            total: logs.length,
            correct,
            wrong: logs.length - correct,
        };
    },
};