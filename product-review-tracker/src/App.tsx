import "./App.css";
import FilterTabs from "../components/FilterTabs";
import ProductList from "../components/ProductList";
import SelectedProductPanel from "../components/SelectedProductPanel";
import ProductLoadError from "../components/ProductLoadError";
import ProductListSkeleton from "../components/ProductListSkeleton";
import ReviewSummary from "../components/ReviewSummary";
import { useEffect, useState, type ReactNode } from "react";
import type { Product, ProductFilter, ProductsResponse } from "./types/product";

 

function App() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<Product[]>([]);

  const [filter, setFilter] = useState<ProductFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const visibleProducts =
    filter === "all"
      ? products
      : products.filter((product) => product.reviewStatus === filter);

  const reviewedCount = products.filter(
    (product) => product.reviewStatus === "reviewed",
  ).length;

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://dummyjson.com/products?limit=3", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: ProductsResponse = await response.json();
        const nextProducts: Product[] = data.products.map((apiProduct) => ({
          id: String(apiProduct.id),
          name: apiProduct.title,
          description: apiProduct.description,
          price: apiProduct.price,
          imageUrl: apiProduct.thumbnail,
          reviewStatus: "new",
        }));

        setProducts(nextProducts);
        setSelectedProductId((currentId) =>
          nextProducts.some((product) => product.id === currentId)
            ? currentId
            : (nextProducts[0]?.id ?? null),
        );
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load products.",
        );
        setProducts([]);
        setSelectedProductId(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [requestVersion]);

  let productContent: ReactNode;

  if (isLoading) {
    productContent = <ProductListSkeleton />;
  } else if (error) {
    productContent = (
      <ProductLoadError
        message={error}
        onRetry={() => setRequestVersion((version) => version + 1)}
      />
    );
  } else if (products.length === 0) {
    productContent = (
      <p className='rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600'>
        No products found.
      </p>
    );
  } else {
    productContent = (
      <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]'>
        <ProductList
          products={visibleProducts}
          selectedProductId={selectedProductId}
          onSelect={setSelectedProductId}
        />
        <SelectedProductPanel product={selectedProduct} />
      </div>
    );
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
            totalCount={products.length}
          />
        </header>

        <div className='mt-6'>
          <FilterTabs filter={filter} onFilterChange={setFilter} />
        </div>
        {productContent}
      </section>
    </main>
  );
}

export default App;
