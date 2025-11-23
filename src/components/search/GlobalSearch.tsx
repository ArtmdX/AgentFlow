'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, FileText, Users, User, CreditCard, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

interface SearchResult {
  id: string;
  type: 'customer' | 'travel' | 'passenger' | 'payment';
  title: string;
  subtitle: string;
  url: string;
  meta?: Record<string, unknown>;
}

interface SearchResults {
  customers: SearchResult[];
  travels: SearchResult[];
  passengers: SearchResult[];
  payments: SearchResult[];
}

const TYPE_ICONS = {
  customer: Users,
  travel: FileText,
  passenger: User,
  payment: CreditCard
};

const TYPE_LABELS = {
  customer: 'Cliente',
  travel: 'Viagem',
  passenger: 'Passageiro',
  payment: 'Pagamento'
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch search results
  const { data, isLoading } = useQuery<SearchResults>({
    queryKey: ['global-search', query],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return { customers: [], travels: [], passengers: [], payments: [] };
      }

      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Erro ao buscar');
      return res.json();
    },
    enabled: query.length >= 2
  });

  // Flatten results for keyboard navigation
  const allResults = useMemo(() => {
    return data ? [
      ...data.customers,
      ...data.travels,
      ...data.passengers,
      ...data.payments
    ] : [];
  }, [data]);

  const totalResults = allResults.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }

      // Arrow keys for navigation
      if (isOpen && totalResults > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % totalResults);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selected = allResults[selectedIndex];
          if (selected) {
            router.push(selected.url);
            setIsOpen(false);
            setQuery('');
            setSelectedIndex(0);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalResults, allResults, router]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleResultClick = useCallback((url: string) => {
    router.push(url);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, [router]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderResults = () => {
    if (!data) return null;

    if (query.length < 2) {
      return (
        <div className="p-8 text-center text-gray-500">
          Digite pelo menos 2 caracteres para buscar...
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-gray-600 mt-2">Buscando...</p>
        </div>
      );
    }

    if (totalResults === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          Nenhum resultado encontrado para &quot;{query}&quot;
        </div>
      );
    }

    let currentIndex = 0;

    return (
      <div className="divide-y divide-gray-200" ref={resultsRef}>
        {Object.entries(data).map(([type, results]) => {
          if (results.length === 0) return null;

          return (
            <div key={type} className="p-2">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                {TYPE_LABELS[type as keyof typeof TYPE_LABELS]}s ({results.length})
              </div>
              <div className="space-y-1">
                {results.map((result) => {
                  const Icon = TYPE_ICONS[result.type];
                  const index = currentIndex++;

                  return (
                    <button
                      key={result.id}
                      data-index={index}
                      onClick={() => handleResultClick(result.url)}
                      className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                          index === selectedIndex ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {highlightMatch(result.title, query)}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {highlightMatch(result.subtitle, query)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-white border border-gray-300 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
                setSelectedIndex(0);
              }}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Buscar clientes, viagens, passageiros..."
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setSelectedIndex(0);
                      inputRef.current?.focus();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {renderResults()}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↓</kbd>
                    navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
                    selecionar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">esc</kbd>
                    fechar
                  </span>
                </div>
                {totalResults > 0 && (
                  <span>{totalResults} resultado{totalResults !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
