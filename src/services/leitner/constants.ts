import type { LeitnerConfig } from './types';

/**
 * فواصل پیش‌فرض جعبه‌ها به میلی‌ثانیه
 * 
 * طبق سیاست اولیه محصول:
 * Box 1: یک روز
 * Box 2: دو روز
 * Box 3: چهار روز
 * Box 4: هفت روز
 * Box 5: پانزده روز
 */
const DAY = 24 * 60 * 60 * 1000;

export const DEFAULT_BOX_INTERVALS: number[] = [
    1 * DAY,   // جعبه ۱: یک روز
    2 * DAY,   // جعبه ۲: دو روز
    4 * DAY,   // جعبه ۳: چهار روز
    7 * DAY,   // جعبه ۴: هفت روز
    15 * DAY,  // جعبه ۵: پانزده روز
];

/**
 * تنظیمات پیش‌فرض الگوریتم
 */
export const DEFAULT_CONFIG: LeitnerConfig = {
    boxIntervals: DEFAULT_BOX_INTERVALS,
    maxBox: 5,
    forgotResetMinutes: 10,  // ده دقیقه بعد از بلد نبودم
    hardIntervalMultiplier: 0.5,  // نصف فاصله عادی برای سخت بود
};

/**
 * تعداد جعبه‌ها
 */
export const BOX_COUNT = DEFAULT_CONFIG.maxBox;