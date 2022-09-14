import { useLocalStorage } from './useLocalStorage'
import { useMedia } from './useMedia'
import { useEffect } from 'react'

const usePrefersDarkMode = () => {
    return useMedia<boolean>(['(prefers-color-scheme: dark)'], [true], false)
}
const useDarkMode = () => {
    const [enabledState, setEnabledState] = useLocalStorage<boolean>(
        'dark-mode-enabled',
        false
    )
    const prefersDarkMode = usePrefersDarkMode()

    const enabled = enabledState ?? prefersDarkMode

    useEffect(() => {
        const className = 'dark-mode'
        const element = window.document.body

        if (enabled) {
            element.classList.add(className)
        } else {
            element.classList.remove(className)
        }
    }, [enabled])

    return [enabled, setEnabledState]
}

export default useDarkMode
