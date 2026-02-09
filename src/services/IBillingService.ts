export interface ProductDetails {
    productId: string;
    title: string;
    description: string;
    price: string;
    currency: string;
}

export interface IBillingService {
    getProductDetails(productId: string): Promise<ProductDetails>;
    purchaseSubscription(productId: string): Promise<boolean>;
    restorePurchases(): Promise<boolean>;
    isPro(): boolean;
}
