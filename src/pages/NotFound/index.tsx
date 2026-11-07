import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    صفحه پیدا نشد
                </h1>
                <p className="text-gray-600 mb-6">
                    متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.
                </p>
                <Link to="/" className="btn-primary inline-block">
                    بازگشت به خانه
                </Link>
            </div>
        </div>
    );
}