export function debounced (fn: Function, delay: number) {
    let id: NodeJS.Timeout;
    return function e(...args: any) {
        clearTimeout(id);
        id = setTimeout(() => fn(...args), delay)
    }
};