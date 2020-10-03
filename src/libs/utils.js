export function throttle(callback, interval) {
    let enableCall = true;

    return function (...args) {
        if (!enableCall) {
            return;
        }

        enableCall = false;
        callback(...args);
        setTimeout(() => (enableCall = true), interval);
    };
}

export function debounce(callback, delayMs) {
    let timerId = null;

    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback(...args), delayMs);
    };
}

