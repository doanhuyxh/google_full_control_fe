"use client"

import { useEffect, useState } from "react"
import { get, set } from "idb-keyval"

type SetValue<T> = T | ((val: T) => T)

function useIndexedDBStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void, boolean] {
    const [storedValue, setStoredValue] = useState<T>(initialValue)
    const [isReady, setIsReady] = useState(false)

    // Load từ IndexedDB lúc đầu
    useEffect(() => {
        let isMounted = true
        setIsReady(false)
        get<T>(key)
            .then((item) => {
                if (item !== undefined && isMounted) {
                    setStoredValue(item)
                }
                if (isMounted) {
                    setIsReady(true)
                }
            })
            .catch((err) => {
                console.error("IndexedDB get error:", err)
                if (isMounted) {
                    setIsReady(true)
                }
            })
        return () => {
            isMounted = false
        }
    }, [key])

    // Hàm set giá trị và lưu vào IndexedDB
    const setValue = (value: SetValue<T>) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        set(key, valueToStore).catch((err) => console.error("IndexedDB set error:", err))
    }

    return [storedValue, setValue, isReady]
}

export default useIndexedDBStorage