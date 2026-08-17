import type { Product } from "../src/App";

type ReviewSummaryProps = {
  products: Product[];
};

function ReviewSummary({ products }: ReviewSummaryProps) {
  const reviewedCount = products.filter(
    (product) => product.reviewStatus === "reviewed",
  ).length;

  return (
    <p className='text-sm text-slate-600'>
      Reviewed {reviewedCount} of {products.length} products
    </p>
  );
}

export default ReviewSummary;
