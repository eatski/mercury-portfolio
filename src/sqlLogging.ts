const EVENT_KEY = "SQL_LOGGING_EVENT";
export const dispatch = (sql: string) => {
    window.dispatchEvent(new CustomEvent(EVENT_KEY, {
        detail: sql
    }))
}

export const addListener = (callback: (sql: string) => void): () => void => {
    const listener = (event: Event) => {
        event instanceof CustomEvent && callback(event.detail)
    }
    window.addEventListener(EVENT_KEY, listener);
    return () => window.removeEventListener(EVENT_KEY, listener);
}