import FilterTabs from "./FilterTabs";
import ProductList from "./ProductList";
import SelectedProductPanel from "./SelectedProductPanel";
import type { Product, ProductFilter } from "../../src/types/product";

type ProductWorkspaceProps = {
  visibleProducts: Product[];
  selectedProductId: string | null;
  selectedProduct: Product | undefined;
  filter: ProductFilter;
  onFilterChange: (filter: ProductFilter) => void;
  onSelectProduct: (productId: string) => void;
  onMarkReviewed: (productId: string) => void;
};

function ProductWorkspace({
  visibleProducts,
  selectedProductId,
  selectedProduct,
  filter,
  onFilterChange,
  onSelectProduct,
  onMarkReviewed,
}: ProductWorkspaceProps) {
  return (
    <section aria-label='Product review workspace'>
      <FilterTabs filter={filter} onFilterChange={onFilterChange} />

      <div className='mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]'>
        <ProductList
          products={visibleProducts}
          selectedProductId={selectedProductId}
          onSelect={onSelectProduct}
        />

        <SelectedProductPanel
          product={selectedProduct}
          onMarkReviewed={onMarkReviewed}
        />
      </div>
    </section>
  );
}
export default ProductWorkspace;
