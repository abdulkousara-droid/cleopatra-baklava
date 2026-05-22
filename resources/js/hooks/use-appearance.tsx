// Stub - appearance is hardcoded to light (dark mode removed)
export function useAppearance() {
    return { appearance: 'light' as const };
}

export function initializeTheme() {
    // no-op: theme is always light
}
