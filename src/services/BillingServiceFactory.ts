import { IBillingService } from './IBillingService';
import { MockBillingService } from './MockBillingService';
import { GooglePlayBillingService } from './GooglePlayBillingService';
import { Capacitor } from '@capacitor/core';

export const getBillingService = (): IBillingService => {
    // Check if we are in a native environment (Android/iOS)
    if (Capacitor.isNativePlatform()) {
        return GooglePlayBillingService.getInstance();
    }

    // Otherwise (Web/Dev), use Mock
    return MockBillingService.getInstance();
};

// Default export for convenience
export const billingService = getBillingService();
