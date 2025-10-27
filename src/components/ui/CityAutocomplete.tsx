'use client';

/**
 * City Autocomplete Component
 *
 * Autocomplete input for Brazilian cities with IATA codes
 * Format: "CODE - City/State" (e.g., "BSB - Brasília/DF")
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/Input';

interface CityOption {
  value: string;
  label: string;
  iataCode: string;
  cityName: string;
  state: string;
  stateCode: string;
  airportName?: string;
}

interface CityAutocompleteProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CityAutocomplete({
  label,
  value = '',
  onChange,
  error,
  placeholder = 'Digite o código IATA ou nome da cidade',
  required = false,
  disabled = false,
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<CityOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced search function
  const searchCities = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const data = await response.json();
      setOptions(data.results || []);
      setIsOpen(data.results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching cities:', error);
      setOptions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      searchCities(newValue);
    }, 300);
  };

  // Handle option selection
  const handleSelectOption = (option: CityOption) => {
    setInputValue(option.value);
    onChange(option.value);
    setIsOpen(false);
    setOptions([]);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < options.length) {
          handleSelectOption(options[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Scroll selected option into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.trim().length >= 2 && options.length > 0) {
            setIsOpen(true);
          }
        }}
        error={error}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-9 text-gray-400">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Dropdown menu */}
      {isOpen && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={`${option.iataCode}-${index}`}
              data-index={index}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-900'
              }`}
              onClick={() => handleSelectOption(option)}
              onMouseEnter={() => setSelectedIndex(index)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">
                    <span className="text-blue-600 font-bold">{option.iataCode}</span>
                    <span className="text-gray-600"> - {option.cityName}</span>
                    <span className="text-gray-500">/{option.stateCode}</span>
                  </div>
                  {option.airportName && (
                    <div className="text-sm text-gray-500 mt-0.5">{option.airportName}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && !isLoading && options.length === 0 && inputValue.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-3 text-gray-500 text-sm">
          Nenhuma cidade encontrada para &quot;{inputValue}&quot;
        </div>
      )}
    </div>
  );
}
