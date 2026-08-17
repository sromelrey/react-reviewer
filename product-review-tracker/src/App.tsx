import "./App.css";
import ProductCard from "../components/ProductCard";
import ReviewSummary from "../components/ReviewSummary";

 export type Product = {
   id: string;
   name: string;
   description: string;
   price: number;
   reviewStatus: "new" | "reviewed";
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
  return (
    <main className='min-h-screen bg-slate-50 p-6 text-slate-950'>
      <section className='mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h1 className='text-3xl font-bold tracking-normal bg-blue-600'>
          Product Review Tracker
        </h1>
        <p className='mt-2 text-lg text-slate-600'>Static product cards</p>
        <ReviewSummary products={products} />
        <ProductCard products={products} />
      </section>
    </main>
  );
}

export default App;
