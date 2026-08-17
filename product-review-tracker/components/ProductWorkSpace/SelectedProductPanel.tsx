import ProductStatusBadge from "./ProductStatusBadge";
import type { Product } from "../../src/types/product";

type SelectedProductPanelProps = {
  product: Product | undefined;
  onMarkReviewed: (productId: string) => void;
};

function SelectedProductPanel({
  product,
  onMarkReviewed,
}: SelectedProductPanelProps) {
  if (!product) {
    return (
      <aside className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
        <p className='text-sm text-slate-600'>
          Select a product to view details.
        </p>
      </aside>
    );
  }

  return (
    <aside className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
      <p className='text-sm font-medium text-slate-500'>Selected product</p>

      <div className='mt-3 flex items-start justify-between gap-3'>
        <h2 className='text-lg font-semibold text-slate-950'>{product.name}</h2>

        <ProductStatusBadge status={product.reviewStatus} />
      </div>

      <p className='mt-2 text-sm leading-6 text-slate-600'>
        {product.description}
      </p>

      <p className='mt-4 text-lg font-bold text-slate-950'>${product.price}</p>
      {product.reviewStatus === "new" ? (
        <button
          type='button'
          className='mt-6 w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700'
          onClick={() => onMarkReviewed(product.id)}
        >
          Mark as reviewed
        </button>
      ) : (
        <p className='mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-center font-medium text-emerald-700'>
          Review complete
        </p>
      )}
    </aside>
  );
}

export default SelectedProductPanel;
