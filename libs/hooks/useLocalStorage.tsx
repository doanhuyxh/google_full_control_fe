import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') return initialValue;
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = (value: SetValue<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                window.dispatchEvent(new Event('local-storage'));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // lắng nghe event storage hoặc custom event từ setValue
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.log(`error retrieving localStorage key “${key}”:`, error);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;
