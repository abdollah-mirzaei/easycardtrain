// ===== موجودیت‌های اصلی =====

export interface Student {
    id?: number;
    name: string;
    field: Field;
    grade: Grade;
    createdAt: Date;
    updatedAt: Date;
}

export type Field =
    | 'math'      // ریاضی
    | 'experimental'  // تجربی
    | 'humanities'  // انسانی
    | 'other';

export type Grade =
    | 'grade10'  // دهم
    | 'grade11'  // یازدهم
    | 'grade12'  // دوازدهم
    | 'konkur';  // کنکوری

export interface Subject {
    id?: number;
    name: string;
    studentId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Chapter {
    id?: number;
    name: string;
    subjectId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Topic {
    id?: number;
    name: string;
    chapterId: number;
    createdAt: Date;
    updatedAt: Date;
}

// ===== فلش‌کارت =====

export interface Flashcard {
    id?: number;
    subjectId: number;
    chapterId: number;
    topicId: number;
    question: string;
    answer: string;
    explanation?: string;
    source?: string;
    createdAt: Date;
    updatedAt: Date;

    // ===== فیلدهای مرور (فاز ۴) =====
    /** شماره جعبه فعلی (از ۱ شروع می‌شود) */
    boxNumber: number;
    /** وضعیت کارت */
    status: CardStatus;
    /** زمان آخرین مرور */
    lastReviewAt?: Date;
    /** زمان مرور بعدی */
    nextReviewAt: Date;
    /** تعداد کل مرورها */
    reviewCount: number;
    /** تعداد پاسخ‌های صحیح (خوب + کاملاً مسلط) */
    correctCount: number;
    /** تعداد پاسخ‌های اشتباه (بلد نبودم + سخت) */
    wrongCount: number;
}

// ===== لیبل‌های فارسی =====

export const FIELD_LABELS: Record<Field, string> = {
    math: 'ریاضی و فیزیک',
    experimental: 'علوم تجربی',
    humanities: 'علوم انسانی',
    other: 'سایر',
};

export const GRADE_LABELS: Record<Grade, string> = {
    grade10: 'پایه دهم',
    grade11: 'پایه یازدهم',
    grade12: 'پایه دوازدهم',
    konkur: 'کنکوری',
};

// ===== وضعیت کارت =====

export enum CardStatus {
    /** جدید - آماده مرور برای اولین بار */
    NEW = 'new',
    /** در حال یادگیری */
    LEARNING = 'learning',
    /** در حال مرور */
    REVIEW = 'review',
    /** مسلط شده - در جعبه آخر */
    MASTERED = 'mastered',
}

// ===== ارزیابی مرور =====

export enum ReviewRating {
    /** بلد نبودم */
    FORGOT = 'forgot',
    /** سخت بود */
    HARD = 'hard',
    /** خوب بود */
    GOOD = 'good',
    /** کاملاً مسلط */
    PERFECT = 'perfect',
}

// ===== سابقه ارزیابی =====

export interface ReviewLog {
    id?: number;
    flashcardId: number;
    rating: ReviewRating;
    boxBefore: number;
    boxAfter: number;
    reviewedAt: Date;
}