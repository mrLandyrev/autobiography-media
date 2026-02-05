export const formatRouteTime = (time: number): string => {
    const hours = Math.trunc(time / 3600);
    const minutes = Math.round(time % 3600 / 60);
    if (hours > 0) {
        if (minutes > 0) {
            return `${hours.toFixed(0)}ч ${minutes.toFixed(0)}м`;
        }
        return `${hours.toFixed(0)}ч`;
    }
    return `${minutes.toFixed(0)}м`;
}

export const formatRouteDistance = (distance: number): string => {
    const km = Math.trunc(distance / 1000);
    const m = Math.trunc(distance % 1000);
    if (km > 0) {
        if (m > 0) {
            return `${km.toFixed(0)}км ${m.toFixed(0)}м`;
        }
        return `${km.toFixed(0)}км`;
    }
    return `${m.toFixed(0)}м`;
}