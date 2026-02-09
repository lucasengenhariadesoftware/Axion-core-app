import { useRunStore, LatLng } from '../store/runStore';

class RunService {
    private watchId: number | null = null;

    startTracking() {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const latLng: LatLng = {
                    lat: latitude,
                    lng: longitude,
                    timestamp: position.timestamp,
                    accuracy
                };

                // Update store
                useRunStore.getState().updateRun(latLng);
            },
            (error) => {
                console.error("Geolocation error:", error);
                // Handle error state in store if needed
            },
            options
        );
    }

    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}

export const runService = new RunService();
