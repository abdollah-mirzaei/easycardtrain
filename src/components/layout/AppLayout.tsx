import { Outlet, Link, useLocation } from 'react-router-dom';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { InstallPrompt } from '../common/InstallPrompt';

const navigation = [
    { name: 'خانه', path: '/', icon: '🏠' },
    { name: 'مرور', path: '/review', icon: '📚' },
    { name: 'درس‌های من', path: '/subjects', icon: '📖' },
    { name: 'فلش‌کارت‌ها', path: '/flashcards', icon: '🎴' },
    { name: 'گزارش‌ها', path: '/reports', icon: '📊' },
    { name: 'تنظیمات', path: '/settings', icon: '⚙️' },
];

export function AppLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* کامپوننت‌های جدید PWA */}
            <OfflineIndicator />
            <InstallPrompt />

            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold text-primary-600">
                            EasyCardTrain
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav
                aria-label="منوی اصلی"
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden"
            >
                <div className="grid grid-cols-6 gap-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center py-3 px-1 text-xs ${isActive
                                        ? 'text-primary-600 font-medium'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-xl mb-1">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Side Navigation (Desktop) */}
            <nav
                aria-label="منوی اصلی"
                className="hidden md:block fixed right-0 top-16 bottom-0 w-64 bg-white border-l border-gray-200 overflow-y-auto"
            >
                <div className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}