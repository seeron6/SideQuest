export const loadGoogleMaps = async (apiKey: string): Promise<any> => {
    if ((window as any).google && (window as any).google.maps) {
        return (window as any).google.maps;
    }

    return new Promise((resolve, reject) => {
        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
            // Wait for it to load
            const checkInterval = setInterval(() => {
                if ((window as any).google && (window as any).google.maps) {
                    clearInterval(checkInterval);
                    resolve((window as any).google.maps);
                }
            }, 100);
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve((window as any).google.maps);
        script.onerror = (err) => reject(new Error('Failed to load Google Maps script: ' + err));
        document.head.appendChild(script);
    });
};
