import "./App.css";
import ProductWorkspace from "../components/ProductWorkSpace";
import ProductLoadError from "../components/ProductWorkSpace/ProductLoadError";
import ProductListSkeleton from "../components/ProductWorkSpace/ProductListSkeleton";
import ReviewSummary from "../components/ReviewSummary";
import { useEffect, useReducer, useState } from "react";
import type { Product, ProductFilter, ProductsResponse } from "./types/product";
import {
  initialProductState,
  productReducer,
} from "../components/ProductWorkSpace/reducer";
 

function App() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const [state, dispatch] = useReducer(productReducer, initialProductState);

  const visibleProducts =
    state.filter === "all"
      ? state.products
      : state.products.filter(
          (product) => product.reviewStatus === state.filter,
        );

  const reviewedCount = state.products.filter(
    (product) => product.reviewStatus === "reviewed",
  ).length;

  const selectedProduct = state.products.find(
    (product) => product.id === state.selectedProductId,
  );

useEffect(() => {
  const controller = new AbortController();

  async function loadProducts() {
    dispatch({ type: "productsLoadStarted" });

    try {
      const response = await fetch("https://dummyjson.com/products?limit=3", {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      const products: Product[] = data.products.map((apiProduct) => ({
        id: String(apiProduct.id),
        name: apiProduct.title,
        description: apiProduct.description,
        price: apiProduct.price,
        imageUrl: apiProduct.thumbnail,
        reviewStatus: "new",
      }));

      dispatch({ type: "productsLoaded", products });
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      dispatch({
        type: "productsLoadFailed",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load products.",
      });
    }
  }

  void loadProducts();

  return () => controller.abort();
}, [state.requestVersion]);

function handleSelectProduct(productId: string) {
  dispatch({ type: "productSelected", productId });
}

function handleFilterChange(filter: ProductFilter) {
  dispatch({ type: "filterChanged", filter });
}

function handleMarkReviewed(productId: string) {
  dispatch({ type: "productReviewed", productId });
}

function handleRetry() {
  dispatch({ type: "productsReloadRequested" });
}

  return (
    <main className='min-h-screen bg-slate-50 p-6 text-slate-950'>
      <section className='mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
        <header className='flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-slate-950'>
              Product Review Tracker
            </h1>
            <p className='text-lg text-slate-600'>Review products by status</p>
          </div>
          <ReviewSummary
            reviewedCount={reviewedCount}
            totalCount={state.products.length}
          />
        </header>

        <div className='mt-6'>
          {state.isLoading ? <ProductListSkeleton /> : null}

          {!state.isLoading && state.error ? (
            <ProductLoadError message={state.error} onRetry={handleRetry} />
          ) : null}

          {!state.isLoading && !state.error && state.products.length === 0 ? (
            <p className='rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600'>
              No products found.
            </p>
          ) : null}

          {!state.isLoading && !state.error && state.products.length > 0 ? (
            <ProductWorkspace
              visibleProducts={visibleProducts}
              selectedProductId={state.selectedProductId}
              selectedProduct={selectedProduct}
              filter={state.filter}
              onFilterChange={handleFilterChange}
              onSelectProduct={handleSelectProduct}
              onMarkReviewed={handleMarkReviewed}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default App;
