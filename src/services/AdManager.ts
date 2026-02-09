import { AdMob, AdLoadInfo, InterstitialAdPluginEvents, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { useUserStore } from '../store/userStore';

class AdManagerService {
    private static instance: AdManagerService;
    private initialized = false;
    private isAdLoaded = false;
    private isLoading = false;
    private lastAdTime = 0;
    private dailyAdCount = 0;
    private isBannerVisible = false;

    // Config
    private readonly IS_native = Capacitor.isNativePlatform();
    // Use Test ID for specific development/test scenarios if needed, but per request we use Prod ID in code 
    // and rely on AdMob Test Mode on devices. However, strict adherence to guidelines suggests using Test IDs 
    // during development. I will implement a check.
    private readonly PROD_INTERSTITIAL_ID = 'ca-app-pub-7774247906326215/8167320817';
    // Google Generic Test ID for Interstitial
    private readonly TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

    // Banner IDs
    private readonly PROD_BANNER_ID = 'ca-app-pub-7774247906326215/9610256810';
    private readonly TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';

    private readonly COOLDOWN_MS = 20 * 60 * 1000; // 20 minutes
    private readonly MAX_DAILY_ADS = 5;

    // State Storage Keys
    private readonly KEY_LAST_AD_TIME = 'ad_last_timestamp';
    private readonly KEY_DAILY_COUNT = 'ad_daily_count';
    private readonly KEY_LAST_RESET_DATE = 'ad_last_reset_date';

    private constructor() {
        this.checkDailyReset();
    }

    public static getInstance(): AdManagerService {
        if (!AdManagerService.instance) {
            AdManagerService.instance = new AdManagerService();
        }
        return AdManagerService.instance;
    }

    public async initialize() {
        if (this.initialized) return;

        try {
            if (this.IS_native) {
                await AdMob.initialize({
                    // requestTrackingAuthorization: true, // Handled separately or by UMP
                    initializeForTesting: true,
                });

                // Set up listeners
                AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
                    this.isAdLoaded = true;
                    this.isLoading = false;
                    console.log('[AdManager] Interstitial Loaded', info);
                });

                AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error: any) => {
                    this.isLoading = false;
                    this.isAdLoaded = false;
                    console.error('[AdManager] Interstitial Failed to Load', error);
                    // Retry strategy could be implemented here (e.g., wait 30s then try again)
                    setTimeout(() => this.preloadInterstitial(), 30000);
                });

                AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
                    this.isAdLoaded = false;
                    this.recordAdShown();
                    this.preloadInterstitial(); // Auto reload next
                });

                this.initialized = true;
                this.preloadInterstitial();
            } else {
                console.log('[AdManager] Web environment detected. Ads will be mocked.');
                this.initialized = true;
            }
        } catch (error) {
            console.error('[AdManager] Initialization failed', error);
        }
    }

    public async preloadInterstitial() {
        if (!this.IS_native) return;
        if (this.isAdLoaded || this.isLoading) return;

        // Check limits before loading to save bandwidth? 
        // AdMob guidelines say it's okay to pre-fetch, but if we are capped, maybe wait.
        if (this.isCapped()) {
            console.log('[AdManager] Daily cap reached or cooldown active. Delaying preload.');
            return;
        }

        try {
            this.isLoading = true;
            await AdMob.prepareInterstitial({
                adId: this.getAdUnitId(),
                isTesting: import.meta.env.DEV, // Use true for safety during dev
            });
        } catch (error) {
            this.isLoading = false;
            console.error('[AdManager] Preload failed', error);
        }
    }

    /**
     * Tries to show an interstitial ad.
     * Returns true if ad was shown, false otherwise.
     * Always resolves, never rejects (unless critical error), so app flow continues.
     */
    public async showInterstitial(): Promise<boolean> {
        // 0. Check Premium
        if (useUserStore.getState().isPremium) {
            console.log('[AdManager] Premium user - Ad skipped');
            return true; // Treat as success so flow continues
        }

        // 1. Check constraints
        if (this.isCapped()) {
            console.log('[AdManager] Ad blocked: Frequency Cap or Cooldown');
            return false;
        }

        // 2. Web Mock
        if (!this.IS_native) {
            console.log('[AdManager] Mock Ad Shown (Web)');
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; font-family: system-ui;
                `;
                overlay.innerHTML = `
                    <h1>AdMob Interstitial (Mock)</h1>
                    <p>This would be a real ad on a device.</p>
                    <button style="padding: 12px 24px; background: #2563EB; color: white; border: none; border-radius: 8px; margin-top: 20px; cursor: pointer;">
                        Close Ad
                    </button>
                    <p style="font-size: 12px; margin-top: 20px; color: #aaa;">Cooldown: 20m | Daily Max: 5</p>
                `;

                const btn = overlay.querySelector('button');
                btn?.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    this.recordAdShown();
                    resolve(true);
                });

                document.body.appendChild(overlay);
            });
        }

        // 3. Native Show
        if (!this.isAdLoaded) {
            console.log('[AdManager] Ad not loaded yet. Attempting lazy load...');
            await this.preloadInterstitial();
            // We generally don't wait for load here to avoid blocking UI. 
            // If it wasn't ready, we skip.
            return false;
        }

        try {
            await AdMob.showInterstitial();
            return true;
        } catch (error) {
            console.error('[AdManager] Failed to show ad', error);
            // If show fails, we assume flow continues
            return false;
        }
    }

    // --- BANNER LOGIC ---

    public async showBanner() {
        if (this.isBannerVisible) return;
        if (useUserStore.getState().isPremium) return; // No banner for premium

        console.log('[AdManager] Requesting Banner Show');

        // Web Mock
        if (!this.IS_native) {
            this.showWebBannerMock();
            this.isBannerVisible = true;
            return;
        }

        try {
            await AdMob.showBanner({
                adId: this.getBannerAdUnitId(),
                position: BannerAdPosition.BOTTOM_CENTER,
                adSize: BannerAdSize.ADAPTIVE_BANNER,
            });
            this.isBannerVisible = true;
        } catch (error) {
            console.error('[AdManager] Failed to show banner', error);
        }
    }

    public async hideBanner() {
        if (!this.isBannerVisible) return;

        console.log('[AdManager] Hiding Banner');

        // Web Mock
        if (!this.IS_native) {
            this.hideWebBannerMock();
            this.isBannerVisible = false;
            return;
        }

        try {
            await AdMob.hideBanner();
            // Or removeBanner() if we want to destroy it completely
            // await AdMob.removeBanner(); 
            this.isBannerVisible = false;
        } catch (error) {
            console.error('[AdManager] Failed to hide banner', error);
        }
    }

    private getBannerAdUnitId(): string {
        if (import.meta.env.DEV) {
            return this.TEST_BANNER_ID;
        }
        return this.PROD_BANNER_ID;
    }

    // --- WEB MOCK UTILS ---
    private showWebBannerMock() {
        const existing = document.getElementById('admob-banner-mock');
        if (existing) return;

        const banner = document.createElement('div');
        banner.id = 'admob-banner-mock';
        banner.style.cssText = `
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            height: 50px; 
            background: #f0f0f0; 
            border-top: 1px solid #ccc;
            display: flex; 
            align-items: center; 
            justify-content: center;
            z-index: 99999;
            color: #555;
            font-size: 12px;
            font-family: sans-serif;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
        `;
        banner.innerHTML = '<span>AdMob Banner (Test/Mock)</span>';
        document.body.appendChild(banner);
    }

    private hideWebBannerMock() {
        const banner = document.getElementById('admob-banner-mock');
        if (banner) {
            document.body.removeChild(banner);
        }
    }

    private getAdUnitId(): string {
        // Always use Test ID for development builds
        if (import.meta.env.DEV) {
            return this.TEST_INTERSTITIAL_ID;
        }
        // In production (built app), use real ID. 
        // Note: Capacitor doesn't always strictly define 'production' environment variable the same way as web.
        // We assume standard Vite build process.
        return this.PROD_INTERSTITIAL_ID;
    }

    private checkDailyReset() {
        const lastReset = localStorage.getItem(this.KEY_LAST_RESET_DATE);
        const today = new Date().toDateString();

        if (lastReset !== today) {
            localStorage.setItem(this.KEY_DAILY_COUNT, '0');
            localStorage.setItem(this.KEY_LAST_RESET_DATE, today);
            this.dailyAdCount = 0;
        } else {
            this.dailyAdCount = parseInt(localStorage.getItem(this.KEY_DAILY_COUNT) || '0', 10);
            this.lastAdTime = parseInt(localStorage.getItem(this.KEY_LAST_AD_TIME) || '0', 10);
        }
    }

    private isCapped(): boolean {
        this.checkDailyReset();
        const now = Date.now();

        // Check Cooldown
        if (now - this.lastAdTime < this.COOLDOWN_MS) {
            return true;
        }

        // Check Daily Max
        if (this.dailyAdCount >= this.MAX_DAILY_ADS) {
            return true;
        }

        return false;
    }

    private recordAdShown() {
        this.lastAdTime = Date.now();
        this.dailyAdCount++;
        localStorage.setItem(this.KEY_LAST_AD_TIME, this.lastAdTime.toString());
        localStorage.setItem(this.KEY_DAILY_COUNT, this.dailyAdCount.toString());
        console.log(`[AdManager] Ad recorded. Daily count: ${this.dailyAdCount}/${this.MAX_DAILY_ADS}`);
    }
}

export const AdManager = AdManagerService.getInstance();
