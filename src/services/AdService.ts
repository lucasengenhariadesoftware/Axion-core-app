import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const APP_ID = 'ca-app-pub-7774247906326215~3772780236';
const TEST_AD_UNIT_ID = 'ca-app-pub-3940256099942544/5354046379'; // Rewarded Interstitial Test
const PRODUCTION_AD_UNIT_ID = 'ca-app-pub-7774247906326215/2499588407';

class AdService {
    private static instance: AdService;
    private isAdLoaded: boolean = false;
    private isLoading: boolean = false;
    private platform: string;
    private isDev: boolean;

    private constructor() {
        this.platform = Capacitor.getPlatform();
        this.isDev = process.env.NODE_ENV === 'development';
        this.initialize();
    }

    public static getInstance(): AdService {
        if (!AdService.instance) {
            AdService.instance = new AdService();
        }
        return AdService.instance;
    }

    private getAdUnitId(): string {
        if (this.isDev || this.platform === 'web') {
            return TEST_AD_UNIT_ID;
        }
        return PRODUCTION_AD_UNIT_ID;
    }

    private async initialize() {
        if (this.platform === 'web') {
            console.log('AdService: Web environment. Ads will be mocked.');
            return;
        }

        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                initializeForTesting: this.isDev,
            });
            console.log('AdService: AdMob initialized.');
        } catch (e) {
            console.error('AdService: Initialization failed', e);
        }
    }

    public async loadRewardedAd() {
        if (this.isLoading || this.isAdLoaded) return;
        this.isLoading = true;

        console.log('AdService: Loading ad...');

        if (this.platform === 'web') {
            setTimeout(() => {
                this.isAdLoaded = true;
                this.isLoading = false;
                console.log('AdService: Mock Ad loaded.');
            }, 2000);
            return;
        }

        try {
            await AdMob.prepareRewardVideoAd({
                adId: this.getAdUnitId(),
                isTesting: this.isDev
            });
            this.isAdLoaded = true;
        } catch (e) {
            console.error('AdService: Failed to load ad', e);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Shows the ad. Returns true if reward was earned, false otherwise.
     */
    public async showRewardedAd(): Promise<boolean> {
        if (!this.isAdLoaded) {
            console.warn('AdService: Ad not ready. Loading now...');
            await this.loadRewardedAd();
            // In a real scenario, you'd fail or wait. For UX, we might just fail here
            // if it takes too long, but let's try to wait a bit in reality.
            if (this.platform !== 'web' && !this.isAdLoaded) return false;
        }

        return new Promise(async (resolve) => {
            if (this.platform === 'web') {
                // WEB MOCK: Use a DOM overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 10000;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; font-family: system-ui;
                `;
                overlay.innerHTML = `
                    <h1>AdMob Rewarded (Mock)</h1>
                    <p>Playing video... (2s)</p>
                    <div style="width: 200px; height: 4px; background: #333; margin-top: 20px; border-radius: 2px; overflow: hidden;">
                        <div id="ad-progress" style="width: 0%; height: 100%; background: #22c55e; transition: width 2s linear;"></div>
                    </div>
                `;
                document.body.appendChild(overlay);

                // Simulate video play
                setTimeout(() => {
                    const progress = document.getElementById('ad-progress');
                    if (progress) progress.style.width = '100%';
                }, 100);

                setTimeout(() => {
                    overlay.innerHTML = `
                        <h1>Ad Completed!</h1>
                        <p>Reward Earned</p>
                        <button id="close-ad-btn" style="padding: 12px 24px; background: #2563EB; color: white; border: none; border-radius: 8px; margin-top: 20px; cursor: pointer;">
                            Close
                        </button>
                    `;
                    const btn = document.getElementById('close-ad-btn');
                    btn?.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                        this.isAdLoaded = false;
                        this.loadRewardedAd();
                        resolve(true);
                    });
                }, 2100);
                return;
            }

            // NATIVE IMPLEMENTATION
            let earnedReward = false;

            const onRewardListener = AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
                console.log('AdService: Reward earned!', reward);
                earnedReward = true;
            });

            const onDismissListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                console.log('AdService: Ad dismissed.');
                onRewardListener.remove();
                onDismissListener.remove();
                this.isAdLoaded = false;
                this.loadRewardedAd(); // Reload for next time
                resolve(earnedReward);
            });

            const onFailedListener = AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (err) => {
                console.error('AdService: Ad failed to show', err);
                onRewardListener.remove();
                onDismissListener.remove();
                onFailedListener.remove();
                resolve(false);
            });

            try {
                await AdMob.showRewardVideoAd();
            } catch (e) {
                console.error('AdService: Error calling show', e);
                resolve(false);
            }
        });
    }

    public isReady(): boolean {
        return this.isAdLoaded;
    }
}

export const adService = AdService.getInstance();
