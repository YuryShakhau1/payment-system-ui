import {apiClient} from "./api_client";
import {ProductData} from "../pages/products/ProductsTab";

export const productService = {

    loadProducts: async (productIds: string[]): Promise<ProductData[]> => {
        const productsRes = await apiClient.post('/products/filter', {
            ids: productIds,
        });

        return productsRes.data;
    },

    loadProductsMap: async (productIds: string[]) => {
        const products = await productService.loadProducts(productIds);
        const productsMap: Record<string, ProductData> = Object.fromEntries(
            products.map(product => [product.id, product])
        );

        return productsMap;
    }
}
