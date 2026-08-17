import type { Product } from "../src/App";
import ProductStatusBadge from "./ProductStatusBadge";

function ProductCard({ products }: { products: Product[] }) {
  return (
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
          <ProductStatusBadge status={product.reviewStatus} />
        </article>
      ))}
    </div>
  );
}

export default ProductCard;
