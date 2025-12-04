'use client';

import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function SearchBar({
    onSearch,
    placeholder = "Search for products...",
    autoFocus = false
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query);
            } else {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div
                className={`
          relative flex items-center glass-card overflow-hidden
          transition-all duration-300
          ${isFocused ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}
        `}
            >
                <Search
                    className={`
            absolute left-4 transition-colors duration-300
            ${isFocused ? 'text-primary' : 'text-gray-400'}
          `}
                    size={24}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="
            w-full pl-14 pr-4 py-4 bg-transparent border-none outline-none
            text-foreground text-lg placeholder-gray-500
          "
                />
                {query && (
                    <button
                        type="submit"
                        className="
              absolute right-2 px-6 py-2 rounded-lg
              bg-gradient-to-r from-primary to-accent
              text-white font-semibold
              hover:shadow-lg hover:shadow-primary/30
              transition-all duration-300
              hover:scale-105
            "
                    >
                        Search
                    </button>
                )}
            </div>
        </form>
    );
}
