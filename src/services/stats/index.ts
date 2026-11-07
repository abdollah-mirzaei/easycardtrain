import { db } from '../../db';
import type { ReviewLog } from '../../types';

export interface DashboardStats {
    totalCards: number;
    dueCards: number;
    reviewedToday: number;
    correctToday: number;
    wrongToday: number;
    successRateToday: number;
    boxCounts: Record<number, number>;
}

export interface SubjectProgress {
    subjectId: number;
    subjectName: string;
    totalCards: number;
    dueCards: number;
    reviewedCards: number;
    correctRate: number;
}

export interface TopicProgress {
    topicId: number;
    topicName: string;
    chapterName: string;
    subjectName: string;
    totalCards: number;
    dueCards: number;
    correctRate: number;
}

export interface RecentReview {
    id?: number;
    flashcardId: number;
    question: string;
    subjectName: string;
    rating: string;
    boxBefore: number;
    boxAfter: number;
    reviewedAt: Date;
}

export const statsService = {
    /**
     * دریافت آمار کلی داشبورد
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const now = new Date();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // تعداد کل کارت‌ها
        const totalCards = await db.flashcards.count();

        // کارت‌های سررسید
        const dueCards = await db.flashcards
            .where('nextReviewAt')
            .belowOrEqual(now)
            .count();

        // مرورهای امروز
        const todayLogs = await db.reviewLogs
            .where('reviewedAt')
            .aboveOrEqual(todayStart)
            .toArray();

        const correctToday = todayLogs.filter(
            (l) => l.rating === 'good' || l.rating === 'perfect'
        ).length;

        const wrongToday = todayLogs.length - correctToday;

        const successRateToday = todayLogs.length > 0
            ? Math.round((correctToday / todayLogs.length) * 100)
            : 0;

        // تعداد کارت‌ها در هر جعبه
        const allCards = await db.flashcards.toArray();
        const boxCounts: Record<number, number> = {};
        for (let i = 1; i <= 5; i++) {
            boxCounts[i] = 0;
        }
        for (const card of allCards) {
            boxCounts[card.boxNumber] = (boxCounts[card.boxNumber] || 0) + 1;
        }

        return {
            totalCards,
            dueCards,
            reviewedToday: todayLogs.length,
            correctToday,
            wrongToday,
            successRateToday,
            boxCounts,
        };
    },

    /**
     * دریافت پیشرفت هر درس
     */
    async getSubjectProgress(): Promise<SubjectProgress[]> {
        const subjects = await db.subjects.toArray();
        const cards = await db.flashcards.toArray();
        const logs = await db.reviewLogs.toArray();
        const now = new Date();

        const result: SubjectProgress[] = [];

        for (const subject of subjects) {
            const subjectCards = cards.filter((c) => c.subjectId === subject.id);
            const dueCards = subjectCards.filter((c) => c.nextReviewAt <= now).length;

            // محاسبه نرخ پاسخ صحیح بر اساس سابقه مرور
            const subjectCardIds = new Set(subjectCards.map((c) => c.id));
            const subjectLogs = logs.filter((l) => subjectCardIds.has(l.flashcardId));

            const correctCount = subjectLogs.filter(
                (l) => l.rating === 'good' || l.rating === 'perfect'
            ).length;

            const correctRate = subjectLogs.length > 0
                ? Math.round((correctCount / subjectLogs.length) * 100)
                : 0;

            result.push({
                subjectId: subject.id!,
                subjectName: subject.name,
                totalCards: subjectCards.length,
                dueCards,
                reviewedCards: subjectCards.filter((c) => c.reviewCount > 0).length,
                correctRate,
            });
        }

        return result.sort((a, b) => b.totalCards - a.totalCards);
    },

    /**
     * دریافت پیشرفت هر مبحث
     */
    async getTopicProgress(): Promise<TopicProgress[]> {
        const topics = await db.topics.toArray();
        const chapters = await db.chapters.toArray();
        const subjects = await db.subjects.toArray();
        const cards = await db.flashcards.toArray();
        const logs = await db.reviewLogs.toArray();
        const now = new Date();

        const result: TopicProgress[] = [];

        for (const topic of topics) {
            const topicCards = cards.filter((c) => c.topicId === topic.id);
            const dueCards = topicCards.filter((c) => c.nextReviewAt <= now).length;

            const topicCardIds = new Set(topicCards.map((c) => c.id));
            const topicLogs = logs.filter((l) => topicCardIds.has(l.flashcardId));

            const correctCount = topicLogs.filter(
                (l) => l.rating === 'good' || l.rating === 'perfect'
            ).length;

            const correctRate = topicLogs.length > 0
                ? Math.round((correctCount / topicLogs.length) * 100)
                : 0;

            const chapter = chapters.find((c) => c.id === topic.chapterId);
            const subject = chapter ? subjects.find((s) => s.id === chapter.subjectId) : null;

            result.push({
                topicId: topic.id!,
                topicName: topic.name,
                chapterName: chapter?.name ?? 'نامشخص',
                subjectName: subject?.name ?? 'نامشخص',
                totalCards: topicCards.length,
                dueCards,
                correctRate,
            });
        }

        return result.sort((a, b) => b.dueCards - a.dueCards);
    },

    /**
     * دریافت آخرین مرورها
     */
    async getRecentReviews(limit: number = 10): Promise<RecentReview[]> {
        const logs = await db.reviewLogs
            .orderBy('reviewedAt')
            .reverse()
            .limit(limit)
            .toArray();

        const cards = await db.flashcards.toArray();
        const subjects = await db.subjects.toArray();

        return logs.map((log) => {
            const card = cards.find((c) => c.id === log.flashcardId);
            const subject = card ? subjects.find((s) => s.id === card.subjectId) : null;

            return {
                ...log,
                question: card?.question ?? 'کارت حذف شده',
                subjectName: subject?.name ?? 'نامشخص',
            };
        });
    },

    /**
     * دریافت سابقه مرور با فیلتر
     */
    async getReviewHistory(filters?: {
        subjectId?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<ReviewLog[]> {
        let logs = await db.reviewLogs.orderBy('reviewedAt').reverse().toArray();

        if (filters?.subjectId) {
            const subjectCards = await db.flashcards
                .where('subjectId')
                .equals(filters.subjectId)
                .toArray();
            const cardIds = new Set(subjectCards.map((c) => c.id));
            logs = logs.filter((l) => cardIds.has(l.flashcardId));
        }

        if (filters?.startDate) {
            logs = logs.filter((l) => l.reviewedAt >= filters.startDate!);
        }

        if (filters?.endDate) {
            logs = logs.filter((l) => l.reviewedAt <= filters.endDate!);
        }

        return logs;
    },
};