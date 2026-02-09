import { IBillingService, ProductDetails } from './IBillingService';

export class MockBillingService implements IBillingService {
    private static instance: MockBillingService;
    private _isPro: boolean = false;

    private constructor() {
        // Initialize state, potentially from local storage for persistence across reloads during dev
        this._isPro = localStorage.getItem('axion_is_pro_mock') === 'true';
    }

    public static getInstance(): MockBillingService {
        if (!MockBillingService.instance) {
            MockBillingService.instance = new MockBillingService();
        }
        return MockBillingService.instance;
    }

    public async getProductDetails(productId: string): Promise<ProductDetails> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (productId === 'axion_pro_monthly') {
            return {
                productId: 'axion_pro_monthly',
                title: 'AXION PRO Monthly',
                description: 'Acesso completo a todos os recursos premium.',
                price: 'R$ 5,99',
                currency: 'BRL'
            };
        }

        throw new Error('Product not found');
    }

    public async purchaseSubscription(productId: string): Promise<boolean> {
        // Simulate purchase flow delay (processing...)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock success
        this._isPro = true;
        localStorage.setItem('axion_is_pro_mock', 'true');
        return true;
    }

    public async restorePurchases(): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return this._isPro;
    }

    public isPro(): boolean {
        return this._isPro;
    }

    // Helper to reset for testing
    public reset() {
        this._isPro = false;
        localStorage.removeItem('axion_is_pro_mock');
    }
}

export const billingService = MockBillingService.getInstance();
