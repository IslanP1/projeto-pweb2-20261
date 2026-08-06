export async function invalidateApiCache(path: string) {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: 'INVALIDATE_CACHE', path });
}
