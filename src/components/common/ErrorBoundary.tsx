import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            خطایی رخ داد
                        </h1>
                        <p className="text-gray-600 mb-6">
                            متأسفانه مشکلی در اجرای برنامه پیش آمده است. لطفاً صفحه را رفرش کنید.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            رفرش صفحه
                        </button>
                        {this.state.error && (
                            <details className="mt-6 text-right">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    جزئیات خطا
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-red-600 overflow-x-auto">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}