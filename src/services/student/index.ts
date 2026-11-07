import { db } from '../../db';
import type { Student } from '../../types';

export const studentService = {
    /**
     * دریافت پروفایل دانش‌آموز
     */
    async getProfile(): Promise<Student | undefined> {
        return await db.students.orderBy('createdAt').first();
    },

    /**
     * ایجاد پروفایل جدید
     */
    async createProfile(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
        const now = new Date();
        return await db.students.add({
            ...data,
            createdAt: now,
            updatedAt: now,
        });
    },

    /**
     * به‌روزرسانی پروفایل
     */
    async updateProfile(id: number, data: Partial<Student>): Promise<void> {
        await db.students.update(id, {
            ...data,
            updatedAt: new Date(),
        });
    },

    /**
     * حذف پروفایل
     */
    async deleteProfile(id: number): Promise<void> {
        await db.students.delete(id);
    },
};