import { db } from '../../db';
import type { Flashcard } from '../../types';
import { CardStatus } from '../../types';

export interface FlashcardFilters {
    subjectId?: number;
    chapterId?: number;
    topicId?: number;
    search?: string;
}

export const flashcardService = {
    /**
     * دریافت تمام فلش‌کارت‌ها
     */
    async getAll(): Promise<Flashcard[]> {
        return await db.flashcards.orderBy('createdAt').toArray();
    },

    /**
     * دریافت فلش‌کارت‌ها با فیلتر و جست‌وجو
     */
    async getFiltered(filters: FlashcardFilters): Promise<Flashcard[]> {
        let cards = await db.flashcards.orderBy('createdAt').toArray();

        if (filters.subjectId) {
            cards = cards.filter((c) => c.subjectId === filters.subjectId);
        }

        if (filters.chapterId) {
            cards = cards.filter((c) => c.chapterId === filters.chapterId);
        }

        if (filters.topicId) {
            cards = cards.filter((c) => c.topicId === filters.topicId);
        }

        if (filters.search) {
            const query = filters.search.trim().toLowerCase();
            cards = cards.filter(
                (c) =>
                    c.question.toLowerCase().includes(query) ||
                    c.answer.toLowerCase().includes(query)
            );
        }

        return cards;
    },

    /**
     * ایجاد فلش‌کارت جدید
     * کارت جدید در وضعیت آماده مرور قرار می‌گیرد
     */
    async create(
        data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'boxNumber' | 'status' | 'nextReviewAt' | 'reviewCount' | 'correctCount' | 'wrongCount'>
    ): Promise<number> {
        const now = new Date();
        return await db.flashcards.add({
            ...data,
            createdAt: now,
            updatedAt: now,
            // فیلدهای مرور - کارت جدید آماده مرور است
            boxNumber: 1,
            status: CardStatus.NEW,
            nextReviewAt: now,  // بلافاصله آماده مرور
            reviewCount: 0,
            correctCount: 0,
            wrongCount: 0,
        });
    },

    /**
     * به‌روزرسانی فلش‌کارت
     */
    async update(
        id: number,
        data: Partial<Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<void> {
        await db.flashcards.update(id, {
            ...data,
            updatedAt: new Date(),
        });
    },

    /**
     * حذف فلش‌کارت
     */
    async delete(id: number): Promise<void> {
        await db.flashcards.delete(id);
    },

    /**
     * حذف تمام فلش‌کارت‌های یک مبحث
     */
    async deleteByTopic(topicId: number): Promise<void> {
        await db.flashcards.where('topicId').equals(topicId).delete();
    },

    /**
     * دریافت تعداد فلش‌کارت‌ها
     */
    async count(): Promise<number> {
        return await db.flashcards.count();
    },

    /**
     * دریافت کارت‌های سررسید شده
     */
    async getDueCards(now: Date = new Date()): Promise<Flashcard[]> {
        return await db.flashcards
            .where('nextReviewAt')
            .belowOrEqual(now)
            .toArray();
    },

    /**
     * دریافت تعداد کارت‌های سررسید شده
     */
    async getDueCount(now: Date = new Date()): Promise<number> {
        return await db.flashcards
            .where('nextReviewAt')
            .belowOrEqual(now)
            .count();
    },

    /**
     * دریافت کارت‌ها بر اساس جعبه
     */
    async getCardsByBox(boxNumber: number): Promise<Flashcard[]> {
        return await db.flashcards
            .where('boxNumber')
            .equals(boxNumber)
            .toArray();
    },

    /**
     * دریافت تعداد کارت‌ها در هر جعبه
     */
    async getBoxCounts(): Promise<Record<number, number>> {
        const cards = await db.flashcards.toArray();
        const counts: Record<number, number> = {};

        for (const card of cards) {
            counts[card.boxNumber] = (counts[card.boxNumber] || 0) + 1;
        }

        return counts;
    },
};