import type { Product } from "../src/App";
import ProductRow from "./ProductRow";

type ProductListProps = {
  products: Product[];
  selectedProductId: string;
  onSelect: (productId: string) => void;
};

function ProductList({
  products,
  selectedProductId,
  onSelect,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className='rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600'>
        No products match this filter.
      </p>
    );
  }

  return (
    <div className='divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          isSelected={product.id === selectedProductId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default ProductList;
