import {useState, useEffect, useCallback} from 'react';
import CountryData from '@/libs/intefaces/countriesData';
import { useAntdApp } from './useAntdApp';
import useLocalStorage from './useLocalStorage';

export default function useCountries() {
    const {notification} = useAntdApp();
    const [countries, setCountries] = useLocalStorage<CountryData[]>('countries', []);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCountries = useCallback(async () => {
        try {
            if (countries.length > 0) {
                setLoading(false);
                return;
            }
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,ccn3,cioc,independent,status,unMember');
            if (!response.ok) {
                throw new Error('Failed to fetch countries data');
            }
            const data: CountryData[] = await response.json();
            setCountries(data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch countries data',
            });
        } finally {
            setLoading(false);
        }
    }, [setCountries, notification]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    return {countries, loading};
}