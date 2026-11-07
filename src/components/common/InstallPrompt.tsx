import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('کاربر برنامه را نصب کرد');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-40 animate-fade-in-up">
            <div className="flex items-start gap-3">
                <span className="text-2xl">📲</span>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">نصب EasyCardTrain</h4>
                    <p className="text-sm text-gray-600 mb-3">
                        برای دسترسی سریع‌تر و استفاده آفلاین، این برنامه را روی دستگاه خود نصب کنید.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleInstall}
                            className="flex-1 btn-primary text-sm py-2"
                        >
                            نصب برنامه
                        </button>
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="flex-1 btn-secondary text-sm py-2"
                        >
                            بعداً
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}