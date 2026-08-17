import type { Product } from "../src/App";

type ProductStatusBadgeProps = {
  status: Product["reviewStatus"];
};
function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <span
      className={
        status === "new"
          ? "rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700"
          : "rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700"
      }
    >
      {status}
    </span>
  );
}

export default ProductStatusBadge;
