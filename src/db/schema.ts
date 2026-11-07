import Dexie, { Table } from 'dexie';
import type { Student, Subject, Chapter, Topic, Flashcard, ReviewLog } from '../types';

export class AppDatabase extends Dexie {
    students!: Table<Student>;
    subjects!: Table<Subject>;
    chapters!: Table<Chapter>;
    topics!: Table<Topic>;
    flashcards!: Table<Flashcard>;
    reviewLogs!: Table<ReviewLog>;

    constructor() {
        super('EasyCardTrainDB');

        this.version(1).stores({
            students: '++id, name, field, grade, createdAt, updatedAt',
            subjects: '++id, name, studentId, createdAt, updatedAt',
            chapters: '++id, name, subjectId, createdAt, updatedAt',
            topics: '++id, name, chapterId, createdAt, updatedAt',
        });

        this.version(2).stores({
            flashcards: '++id, subjectId, chapterId, topicId, createdAt, updatedAt',
        });

        // نسخه ۳: افزودن فیلدهای مرور به فلش‌کارت‌ها و جدول سابقه ارزیابی‌ها
        this.version(3).stores({
            flashcards: '++id, subjectId, chapterId, topicId, createdAt, updatedAt, boxNumber, status, nextReviewAt',
            reviewLogs: '++id, flashcardId, rating, reviewedAt',
        });
    }
}