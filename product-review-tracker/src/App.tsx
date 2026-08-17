import "./App.css";
import FilterTabs from "../components/FilterTabs";
import ProductList from "../components/ProductList";
import SelectedProductPanel from "../components/SelectedProductPanel";
import ReviewSummary from "../components/ReviewSummary";
import { useState } from "react";

type ReviewStatus = "new" | "reviewed";
export type ProductFilter = "all" | ReviewStatus;
 export type Product = {
   id: string;
   name: string;
   description: string;
   price: number;
   reviewStatus: ProductFilter;
 };


const products: Product[] = [
  {
    id: "keyboard",
    name: "Keyboard",
    description:
      "A mechanical keyboard with comfortable keys and RGB lighting.",
    price: 79.99,
    reviewStatus: "new",
  },
  {
    id: "mouse",
    name: "Mouse",
    description:
      "Ergonomic wireless mouse with adjustable DPI and long battery life.",
    price: 49.99,
    reviewStatus: "reviewed",
  },
  {
    id: "monitor",
    name: "Monitor",
    description:
      "27-inch IPS monitor with 144Hz refresh rate and QHD resolution.",
    price: 249.99,
    reviewStatus: "new",
  },
];

function App() {
  const [selectedProductId, setSelectedProductId] = useState("keyboard");
  const [filter, setFilter] = useState<ProductFilter>("all");

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

        <div className='mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]'>
          <ProductList
            products={visibleProducts}
            selectedProductId={selectedProductId}
            onSelect={setSelectedProductId}
          />

          <SelectedProductPanel product={selectedProduct} />
        </div>
      </section>
    </main>
  );
}

export default App;
