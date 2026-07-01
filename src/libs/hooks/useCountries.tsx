import {useState, useEffect, useCallback} from 'react';
import CountryData from '@/libs/interfaces/countriesData';
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
            const response = await fetch(
                'https://api.restcountries.com/countries/v5/codes.alpha_2/ca?pretty=1',
                { headers: { 'Authorization': 'Bearer rc_live_663c3af4a29043ff93c75c43c04c137a' } }
            );
            
            if (!response.ok) {
                
                return;
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