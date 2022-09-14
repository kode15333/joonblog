import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue

        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToString =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToString)

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToString))
            }
        } catch (err) {
            console.error(err)
        }
    }

    return [storedValue, setValue]
}
