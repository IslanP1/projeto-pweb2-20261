export async function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

export async function notifyViaServiceWorker(payload: { title: string; body: string; tag?: string }) {
    if (!('serviceWorker' in navigator)) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: 'SHOW_SPENDING_NOTIFICATION', payload });
}
