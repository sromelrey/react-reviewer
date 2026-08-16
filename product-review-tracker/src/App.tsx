import "./App.css";

type Product = {
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
        <h1 className='text-3xl font-bold tracking-normal'>
          Product Review Tracker
        </h1>
        <p className='mt-2 text-lg text-slate-600'>Static product cards</p>

        <div className='grid gap-4 md:grid-cols-3'>
          {products.map((product) => (
            <article
              key={product.id}
              className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'
            >
              <h2 className='text-xl font-semibold text-slate-950'>
                {product.name}
              </h2>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                {product.description}
              </p>
              <p className='mt-4 text-lg font-bold text-slate-950'>
                ${product.price}
              </p>
              <span
                className={
                  product.reviewStatus === "new"
                    ? "rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700"
                    : "rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700"
                }
              >
                {product.reviewStatus}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
