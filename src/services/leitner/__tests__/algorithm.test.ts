import { describe, it, expect } from 'vitest';
import {
    calculateNextReview,
    determineStatus,
    isCardDue,
    getBoxInterval,
    msToDays,
    formatInterval,
} from '../algorithm';
import { ReviewRating, CardStatus } from '../types';
import { DEFAULT_CONFIG } from '../constants';

describe('Leitner Algorithm', () => {
    describe('calculateNextReview', () => {
        const now = new Date('2026-11-06T10:00:00Z');

        it('should move card to box 1 when FORGOT', () => {
            const result = calculateNextReview(3, ReviewRating.FORGOT, DEFAULT_CONFIG, now);

            expect(result.boxNumber).toBe(1);
            expect(result.status).toBe(CardStatus.LEARNING);

            // ده دقیقه بعد
            const expectedTime = new Date(now.getTime() + 10 * 60 * 1000);
            expect(result.nextReviewAt.getTime()).toBe(expectedTime.getTime());
        });

        it('should keep card in same box when HARD', () => {
            const result = calculateNextReview(2, ReviewRating.HARD, DEFAULT_CONFIG, now);

            expect(result.boxNumber).toBe(2);

            // نصف فاصله جعبه ۲ (دو روز / ۲ = یک روز)
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            const halfInterval = twoDays * DEFAULT_CONFIG.hardIntervalMultiplier;
            const expectedTime = new Date(now.getTime() + halfInterval);
            expect(result.nextReviewAt.getTime()).toBe(expectedTime.getTime());
        });

        it('should promote card one box when GOOD', () => {
            const result = calculateNextReview(1, ReviewRating.GOOD, DEFAULT_CONFIG, now);

            expect(result.boxNumber).toBe(2);
            expect(result.status).toBe(CardStatus.REVIEW);

            // فاصله جعبه ۲ = دو روز
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            const expectedTime = new Date(now.getTime() + twoDays);
            expect(result.nextReviewAt.getTime()).toBe(expectedTime.getTime());
        });

        it('should promote card two boxes when PERFECT', () => {
            const result = calculateNextReview(1, ReviewRating.PERFECT, DEFAULT_CONFIG, now);

            expect(result.boxNumber).toBe(3);
            expect(result.status).toBe(CardStatus.REVIEW);

            // فاصله جعبه ۳ = چهار روز
            const fourDays = 4 * 24 * 60 * 60 * 1000;
            const expectedTime = new Date(now.getTime() + fourDays);
            expect(result.nextReviewAt.getTime()).toBe(expectedTime.getTime());
        });

        it('should not exceed max box when PERFECT from box 4', () => {
            const result = calculateNextReview(4, ReviewRating.PERFECT, DEFAULT_CONFIG, now);

            expect(result.boxNumber).toBe(5);
            expect(result.status).toBe(CardStatus.MASTERED);
        });

        it('should stay in max box when GOOD from max box', () => {
            const result = calculateNextReview(5, ReviewRating.GOOD, DEFAULT_CONFIG, now);

            expect(result.boxNumber).toBe(5);
            expect(result.status).toBe(CardStatus.MASTERED);
        });

        it('should throw error for invalid box number', () => {
            expect(() => calculateNextReview(0, ReviewRating.GOOD, DEFAULT_CONFIG, now)).toThrow();
            expect(() => calculateNextReview(6, ReviewRating.GOOD, DEFAULT_CONFIG, now)).toThrow();
        });
    });

    describe('determineStatus', () => {
        it('should return LEARNING for box 1', () => {
            expect(determineStatus(1)).toBe(CardStatus.LEARNING);
        });

        it('should return REVIEW for middle boxes', () => {
            expect(determineStatus(2)).toBe(CardStatus.REVIEW);
            expect(determineStatus(3)).toBe(CardStatus.REVIEW);
            expect(determineStatus(4)).toBe(CardStatus.REVIEW);
        });

        it('should return MASTERED for max box', () => {
            expect(determineStatus(5)).toBe(CardStatus.MASTERED);
        });
    });

    describe('isCardDue', () => {
        it('should return true when nextReviewAt is in the past', () => {
            const past = new Date('2026-11-05T10:00:00Z');
            const now = new Date('2026-11-06T10:00:00Z');
            expect(isCardDue(past, now)).toBe(true);
        });

        it('should return true when nextReviewAt is now', () => {
            const now = new Date('2026-11-06T10:00:00Z');
            expect(isCardDue(now, now)).toBe(true);
        });

        it('should return false when nextReviewAt is in the future', () => {
            const future = new Date('2026-11-07T10:00:00Z');
            const now = new Date('2026-11-06T10:00:00Z');
            expect(isCardDue(future, now)).toBe(false);
        });
    });

    describe('getBoxInterval', () => {
        it('should return correct interval for each box', () => {
            const day = 24 * 60 * 60 * 1000;

            expect(getBoxInterval(1)).toBe(1 * day);
            expect(getBoxInterval(2)).toBe(2 * day);
            expect(getBoxInterval(3)).toBe(4 * day);
            expect(getBoxInterval(4)).toBe(7 * day);
            expect(getBoxInterval(5)).toBe(15 * day);
        });

        it('should throw error for invalid box number', () => {
            expect(() => getBoxInterval(0)).toThrow();
            expect(() => getBoxInterval(6)).toThrow();
        });
    });

    describe('msToDays', () => {
        it('should convert milliseconds to days', () => {
            const day = 24 * 60 * 60 * 1000;

            expect(msToDays(day)).toBe(1);
            expect(msToDays(2 * day)).toBe(2);
            expect(msToDays(15 * day)).toBe(15);
        });
    });

    describe('formatInterval', () => {
        it('should format hours correctly', () => {
            const hours = 60 * 60 * 1000;
            expect(formatInterval(5 * hours)).toBe('5 ساعت');
        });

        it('should format one day correctly', () => {
            const day = 24 * 60 * 60 * 1000;
            expect(formatInterval(day)).toBe('یک روز');
        });

        it('should format multiple days correctly', () => {
            const day = 24 * 60 * 60 * 1000;
            expect(formatInterval(2 * day)).toBe('2 روز');
            expect(formatInterval(15 * day)).toBe('15 روز');
        });
    });
});