import type { Product } from "../src/types/product";
import ProductStatusBadge from "./ProductStatusBadge";

type ProductRowProps = {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string) => void;
};

function ProductRow({ product, isSelected, onSelect }: ProductRowProps) {
  const rowClassName = isSelected
    ? "flex w-full items-center justify-between gap-4 border-l-4 border-blue-600 bg-blue-50 p-4 text-left"
    : "flex w-full items-center justify-between gap-4 border-l-4 border-transparent bg-white p-4 text-left hover:bg-slate-50";

  return (
    <button
      type='button'
      className={rowClassName}
      aria-pressed={isSelected}
      onClick={() => onSelect(product.id)}
    >
      <span className='flex min-w-0 items-center gap-4'>
        <img
          className='h-16 w-16 shrink-0 rounded-md bg-slate-100 object-cover'
          src={product.imageUrl}
          alt=''
        />

        <span className='truncate text-lg font-semibold text-slate-950'>
          {product.name}
        </span>
      </span>

      <ProductStatusBadge status={product.reviewStatus} />
    </button>
  );
}
export default ProductRow;
