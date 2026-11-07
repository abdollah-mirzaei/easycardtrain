import { db } from '../../db';
import type { Subject, Chapter, Topic } from '../../types';

export const subjectService = {
    /**
     * دریافت تمام دروس
     */
    async getSubjects(): Promise<Subject[]> {
        return await db.subjects.orderBy('name').toArray();
    },

    /**
     * دریافت دروس بر اساس پروفایل
     */
    async getSubjectsByStudent(studentId: number): Promise<Subject[]> {
        return await db.subjects.where('studentId').equals(studentId).sortBy('name');
    },

    /**
     * ایجاد درس جدید
     */
    async createSubject(name: string, studentId: number): Promise<number> {
        const now = new Date();
        return await db.subjects.add({
            name,
            studentId,
            createdAt: now,
            updatedAt: now,
        });
    },

    /**
     * به‌روزرسانی درس
     */
    async updateSubject(id: number, name: string): Promise<void> {
        await db.subjects.update(id, {
            name,
            updatedAt: new Date(),
        });
    },

    /**
     * حذف درس
     */
    async deleteSubject(id: number): Promise<void> {
        // حذف فصل‌ها و مباحث مرتبط
        await this.deleteChaptersBySubject(id);
        await db.subjects.delete(id);
    },

    /**
     * دریافت تمام فصل‌ها
     */
    async getChapters(): Promise<Chapter[]> {
        return await db.chapters.orderBy('name').toArray();
    },

    /**
     * دریافت فصل‌ها بر اساس درس
     */
    async getChaptersBySubject(subjectId: number): Promise<Chapter[]> {
        return await db.chapters.where('subjectId').equals(subjectId).sortBy('name');
    },

    /**
     * ایجاد فصل جدید
     */
    async createChapter(name: string, subjectId: number): Promise<number> {
        const now = new Date();
        return await db.chapters.add({
            name,
            subjectId,
            createdAt: now,
            updatedAt: now,
        });
    },

    /**
     * به‌روزرسانی فصل
     */
    async updateChapter(id: number, name: string): Promise<void> {
        await db.chapters.update(id, {
            name,
            updatedAt: new Date(),
        });
    },

    /**
     * حذف فصل
     */
    async deleteChapter(id: number): Promise<void> {
        await this.deleteTopicsByChapter(id);
        await db.chapters.delete(id);
    },

    /**
     * حذف تمام فصل‌های یک درس
     */
    async deleteChaptersBySubject(subjectId: number): Promise<void> {
        const chapters = await db.chapters.where('subjectId').equals(subjectId).toArray();
        for (const chapter of chapters) {
            await this.deleteTopicsByChapter(chapter.id!);
        }
        await db.chapters.where('subjectId').equals(subjectId).delete();
    },

    /**
     * دریافت تمام مباحث
     */
    async getTopics(): Promise<Topic[]> {
        return await db.topics.orderBy('name').toArray();
    },

    /**
     * دریافت مباحث بر اساس فصل
     */
    async getTopicsByChapter(chapterId: number): Promise<Topic[]> {
        return await db.topics.where('chapterId').equals(chapterId).sortBy('name');
    },

    /**
     * ایجاد مبحث جدید
     */
    async createTopic(name: string, chapterId: number): Promise<number> {
        const now = new Date();
        return await db.topics.add({
            name,
            chapterId,
            createdAt: now,
            updatedAt: now,
        });
    },

    /**
     * به‌روزرسانی مبحث
     */
    async updateTopic(id: number, name: string): Promise<void> {
        await db.topics.update(id, {
            name,
            updatedAt: new Date(),
        });
    },

    /**
     * حذف مبحث
     */
    async deleteTopic(id: number): Promise<void> {
        await db.topics.delete(id);
    },

    /**
     * حذف تمام مباحث یک فصل
     */
    async deleteTopicsByChapter(chapterId: number): Promise<void> {
        await db.topics.where('chapterId').equals(chapterId).delete();
    },
};