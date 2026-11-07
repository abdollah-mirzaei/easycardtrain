import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('App', () => {
    it('renders main navigation', () => {
        render(<App />)

        const navigationElements = screen.getAllByRole('navigation', { name: 'منوی اصلی' })

        expect(navigationElements.length).toBeGreaterThan(0)
    })

    it('renders home page heading', async () => {
        render(<App />)

        // استفاده از findByRole برای انتظار بارگذاری async
        const heading = await screen.findByRole('heading', { name: 'خانه' })
        expect(heading).toBeTruthy()
    })
})