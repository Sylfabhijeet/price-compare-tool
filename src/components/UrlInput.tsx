'use client';

import { useState } from 'react';
import { Plus, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { detectPlatform, isValidUrl } from '@/lib/scrapers';

interface UrlInputProps {
    onCompare: (urls: string[]) => void;
    loading?: boolean;
}

export default function UrlInput({ onCompare, loading = false }: UrlInputProps) {
    const [urls, setUrls] = useState<string[]>(['', '']);
    const [errors, setErrors] = useState<Record<number, string>>({});

    const addUrlField = () => {
        if (urls.length < 10) {
            setUrls([...urls, '']);
        }
    };

    const removeUrlField = (index: number) => {
        if (urls.length > 2) {
            const newUrls = urls.filter((_, i) => i !== index);
            setUrls(newUrls);

            // Remove error for this index
            const newErrors = { ...errors };
            delete newErrors[index];
            setErrors(newErrors);
        }
    };

    const updateUrl = (index: number, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);

        // Validate URL
        if (value.trim()) {
            if (!isValidUrl(value)) {
                setErrors({ ...errors, [index]: 'Invalid URL format' });
            } else {
                const platform = detectPlatform(value);
                if (!platform) {
                    setErrors({ ...errors, [index]: 'Unsupported platform' });
                } else {
                    const newErrors = { ...errors };
                    delete newErrors[index];
                    setErrors(newErrors);
                }
            }
        } else {
            const newErrors = { ...errors };
            delete newErrors[index];
            setErrors(newErrors);
        }
    };

    const handleCompare = () => {
        const validUrls = urls.filter(url => url.trim() !== '');

        if (validUrls.length < 2) {
            alert('Please enter at least 2 product URLs to compare');
            return;
        }

        if (Object.keys(errors).length > 0) {
            alert('Please fix the errors before comparing');
            return;
        }

        onCompare(validUrls);
    };

    const getPlatformColor = (url: string): string => {
        if (!url.trim()) return 'transparent';
        const platform = detectPlatform(url);

        const colors: Record<string, string> = {
            'Amazon': '#FF9900',
            'Flipkart': '#2874F0',
            'Myntra': '#FF3F6C',
            'Snapdeal': '#E40046',
            'Ajio': '#B91C1C',
        };

        return platform ? colors[platform] || 'transparent' : 'transparent';
    };

    return (
        <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
                <LinkIcon className="text-primary" size={28} />
                <div>
                    <h2 className="text-2xl font-bold">Compare Product URLs</h2>
                    <p className="text-gray-400 text-sm">
                        Paste product URLs from different platforms to compare prices in real-time
                    </p>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {urls.map((url, index) => (
                    <div key={index} className="relative">
                        <div className="flex gap-3 items-start">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => updateUrl(index, e.target.value)}
                                        placeholder={`Product URL ${index + 1} (e.g., Amazon, Flipkart)`}
                                        className={`
                      input-field pr-12
                      ${errors[index] ? 'border-error' : ''}
                    `}
                                        disabled={loading}
                                        style={{
                                            borderLeftColor: getPlatformColor(url),
                                            borderLeftWidth: '4px',
                                        }}
                                    />
                                    {url && !errors[index] && detectPlatform(url) && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <span className="text-xs font-semibold text-success">
                                                {detectPlatform(url)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {errors[index] && (
                                    <div className="flex items-center gap-2 mt-2 text-error text-sm">
                                        <AlertCircle size={16} />
                                        {errors[index]}
                                    </div>
                                )}
                            </div>

                            {urls.length > 2 && (
                                <button
                                    onClick={() => removeUrlField(index)}
                                    className="p-3 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
                                    disabled={loading}
                                    title="Remove URL"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                {urls.length < 10 && (
                    <button
                        onClick={addUrlField}
                        className="btn-secondary flex items-center gap-2"
                        disabled={loading}
                    >
                        <Plus size={20} />
                        Add Another URL
                    </button>
                )}

                <button
                    onClick={handleCompare}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={loading || urls.filter(u => u.trim()).length < 2}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Fetching Prices...
                        </>
                    ) : (
                        <>
                            <LinkIcon size={20} />
                            Compare Prices
                        </>
                    )}
                </button>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-gray-300">
                    <strong>Supported Platforms:</strong> Amazon, Flipkart (Myntra, Snapdeal, Ajio coming soon)
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    💡 Tip: Paste direct product page URLs for best results. Prices are fetched in real-time and cached for 24 hours.
                </p>
            </div>
        </div>
    );
}
