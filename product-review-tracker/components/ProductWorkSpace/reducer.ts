import { Product, ProductFilter } from "../../src/types/product";

type ProductState = {
  products: Product[];
  selectedProductId: string | null;
  filter: ProductFilter;
  isLoading: boolean;
  error: string | null;
  requestVersion: number;
};

type ProductAction =
  | { type: "productSelected"; productId: string }
  | { type: "filterChanged"; filter: ProductFilter }
  | { type: "productReviewed"; productId: string }
  | { type: "productsLoadStarted" }
  | { type: "productsLoaded"; products: Product[] }
  | { type: "productsLoadFailed"; message: string }
  | { type: "productsReloadRequested" };

export const initialProductState: ProductState = {
  products: [],
  selectedProductId: null,
  filter: "all",
  isLoading: true,
  error: null,
  requestVersion: 0,
};

export function productReducer(
  state: ProductState,
  action: ProductAction,
): ProductState {
  switch (action.type) {
    case "productSelected":
      return { ...state, selectedProductId: action.productId };

    case "filterChanged":
      return { ...state, filter: action.filter };

    case "productReviewed":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.productId
            ? { ...product, reviewStatus: "reviewed" }
            : product,
        ),
      };

    case "productsLoadStarted":
      return { ...state, isLoading: true, error: null };

    case "productsLoaded": {
      const selectedProductStillExists = action.products.some(
        (product) => product.id === state.selectedProductId,
      );

      return {
        ...state,
        products: action.products,
        selectedProductId: selectedProductStillExists
          ? state.selectedProductId
          : (action.products[0]?.id ?? null),
        isLoading: false,
        error: null,
      };
    }

    case "productsLoadFailed":
      return {
        ...state,
        products: [],
        selectedProductId: null,
        isLoading: false,
        error: action.message,
      };

    case "productsReloadRequested":
      return {
        ...state,
        isLoading: true,
        error: null,
        requestVersion: state.requestVersion + 1,
      };

    default:
      return state;
  }
}
