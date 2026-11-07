/**
 * ارزیابی‌های ممکن توسط دانش‌آموز
 */
export enum ReviewRating {
    /** بلد نبودم - کارت به جعبه اول بازمی‌گردد */
    FORGOT = 'forgot',
    /** سخت بود - کارت در جعبه فعلی باقی می‌ماند */
    HARD = 'hard',
    /** خوب بود - کارت یک سطح ارتقا پیدا می‌کند */
    GOOD = 'good',
    /** کاملاً مسلط - کارت دو سطح ارتقا پیدا می‌کند */
    PERFECT = 'perfect',
}

/**
 * وضعیت کارت در سیستم
 */
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

/**
 * تنظیمات الگوریتم لایتنر
 * این تنظیمات قابل تغییر هستند تا سیاست محصول قابل تنظیم باشد
 */
export interface LeitnerConfig {
    /** فواصل مرور هر جعبه به میلی‌ثانیه */
    boxIntervals: number[];
    /** حداکثر شماره جعبه */
    maxBox: number;
    /** زمان بازگشت بعد از بلد نبودم (به دقیقه) */
    forgotResetMinutes: number;
    /** ضریب فاصله برای ارزیابی سخت بود (بین ۰ تا ۱) */
    hardIntervalMultiplier: number;
}

/**
 * نتیجه محاسبه مرور بعدی
 */
export interface ReviewResult {
    /** شماره جعبه جدید */
    boxNumber: number;
    /** زمان مرور بعدی */
    nextReviewAt: Date;
    /** وضعیت جدید کارت */
    status: CardStatus;
}

/**
 * سابقه یک ارزیابی
 */
export interface ReviewLog {
    id?: number;
    flashcardId: number;
    rating: ReviewRating;
    boxBefore: number;
    boxAfter: number;
    reviewedAt: Date;
}