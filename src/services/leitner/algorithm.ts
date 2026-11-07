import { ReviewRating, CardStatus } from './types';
import type { LeitnerConfig, ReviewResult } from './types';
import { DEFAULT_CONFIG } from './constants';

/**
 * محاسبه زمان مرور بعدی بر اساس ارزیابی دانش‌آموز
 * 
 * این تابع یک pure function است و هیچ وابستگی به خارج ندارد.
 * تمام محاسبات بر اساس اختلاف زمان (میلی‌ثانیه) انجام می‌شود
 * تا تغییر منطقه زمانی مشکل ایجاد نکند.
 * 
 * @param currentBox - شماره جعبه فعلی کارت (از ۱ شروع می‌شود)
 * @param rating - ارزیابی دانش‌آموز
 * @param config - تنظیمات الگوریتم (اختیاری، پیش‌فرض استفاده می‌شود)
 * @param now - زمان فعلی (برای تست‌پذیری قابل تزریق است)
 * @returns نتیجه شامل جعبه جدید، زمان مرور بعدی و وضعیت
 */
export function calculateNextReview(
    currentBox: number,
    rating: ReviewRating,
    config: LeitnerConfig = DEFAULT_CONFIG,
    now: Date = new Date()
): ReviewResult {
    // اعتبارسنجی ورودی‌ها
    if (currentBox < 1 || currentBox > config.maxBox) {
        throw new Error(
            `شماره جعبه باید بین ۱ و ${config.maxBox} باشد، اما ${currentBox} دریافت شد`
        );
    }

    let nextBox = currentBox;
    let intervalMs: number;

    switch (rating) {
        case ReviewRating.FORGOT:
            // بلد نبودم: کارت به جعبه اول بازمی‌گردد
            // و ده دقیقه بعد دوباره قابل مرور است
            nextBox = 1;
            intervalMs = config.forgotResetMinutes * 60 * 1000;
            break;

        case ReviewRating.HARD:
            // سخت بود: کارت در جعبه فعلی باقی می‌ماند
            // با فاصله کوتاه‌تر (نصف فاصله عادی)
            nextBox = currentBox;
            intervalMs = config.boxIntervals[currentBox - 1] * config.hardIntervalMultiplier;
            break;

        case ReviewRating.GOOD:
            // خوب بود: کارت یک سطح ارتقا پیدا می‌کند
            nextBox = Math.min(currentBox + 1, config.maxBox);
            intervalMs = config.boxIntervals[nextBox - 1];
            break;

        case ReviewRating.PERFECT:
            // کاملاً مسلط: کارت دو سطح ارتقا پیدا می‌کند
            // با رعایت حداکثر جعبه آخر
            nextBox = Math.min(currentBox + 2, config.maxBox);
            intervalMs = config.boxIntervals[nextBox - 1];
            break;

        default:
            throw new Error(`ارزیابی نامعتبر: ${rating}`);
    }

    // محاسبه زمان مرور بعدی بر اساس اختلاف زمان
    // این روش در برابر تغییر منطقه زمانی مقاوم است
    const nextReviewAt = new Date(now.getTime() + intervalMs);

    // تعیین وضعیت کارت
    const status = determineStatus(nextBox, config);

    return {
        boxNumber: nextBox,
        nextReviewAt,
        status,
    };
}

/**
 * تعیین وضعیت کارت بر اساس شماره جعبه
 */
export function determineStatus(
    boxNumber: number,
    config: LeitnerConfig = DEFAULT_CONFIG
): CardStatus {
    if (boxNumber >= config.maxBox) {
        return CardStatus.MASTERED;
    }
    if (boxNumber === 1) {
        return CardStatus.LEARNING;
    }
    return CardStatus.REVIEW;
}

/**
 * بررسی اینکه آیا کارت سررسید شده است یا نه
 * 
 * @param nextReviewAt - زمان مرور بعدی کارت
 * @param now - زمان فعلی (برای تست‌پذیری قابل تزریق است)
 * @returns آیا کارت سررسید شده است؟
 */
export function isCardDue(
    nextReviewAt: Date,
    now: Date = new Date()
): boolean {
    return nextReviewAt.getTime() <= now.getTime();
}

/**
 * دریافت تعداد جعبه‌ها
 */
export function getBoxCount(config: LeitnerConfig = DEFAULT_CONFIG): number {
    return config.maxBox;
}

/**
 * دریافت فاصله یک جعبه خاص به میلی‌ثانیه
 * 
 * @param boxNumber - شماره جعبه (از ۱ شروع می‌شود)
 * @param config - تنظیمات الگوریتم
 * @returns فاصله به میلی‌ثانیه
 */
export function getBoxInterval(
    boxNumber: number,
    config: LeitnerConfig = DEFAULT_CONFIG
): number {
    if (boxNumber < 1 || boxNumber > config.maxBox) {
        throw new Error(
            `شماره جعبه باید بین ۱ و ${config.maxBox} باشد، اما ${boxNumber} دریافت شد`
        );
    }
    return config.boxIntervals[boxNumber - 1];
}

/**
 * تبدیل میلی‌ثانیه به روز (برای نمایش)
 */
export function msToDays(ms: number): number {
    return ms / (24 * 60 * 60 * 1000);
}

/**
 * تبدیل میلی‌ثانیه به متن فارسی (برای نمایش)
 */
export function formatInterval(ms: number): string {
    const days = msToDays(ms);

    if (days < 1) {
        const hours = Math.round(ms / (60 * 60 * 1000));
        return `${hours} ساعت`;
    }

    if (days === 1) {
        return 'یک روز';
    }

    return `${days} روز`;
}