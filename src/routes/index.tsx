import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/Home';
import { ReviewPage } from '../pages/Review';
import { SubjectsPage } from '../pages/Subjects';
import { FlashcardsPage } from '../pages/Flashcards';
import { ReportsPage } from '../pages/Reports';
import { SettingsPage } from '../pages/Settings';
import { ProfilePage } from '../pages/Profile';
import { ProfileForm } from '../pages/Profile/ProfileForm';
import { NotFoundPage } from '../pages/NotFound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'review', element: <ReviewPage /> },
            { path: 'subjects', element: <SubjectsPage /> },
            { path: 'flashcards', element: <FlashcardsPage /> },
            { path: 'reports', element: <ReportsPage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'profile', element: <ProfilePage /> },
            { path: 'profile/create', element: <ProfileForm /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);