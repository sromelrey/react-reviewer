type ReviewSummaryProps = {
  reviewedCount: number;
  totalCount: number;
};

function ReviewSummary({ reviewedCount, totalCount }: ReviewSummaryProps) {
  return (
    <p className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700'>
      Reviewed: {reviewedCount}/{totalCount}
    </p>
  );
}
export default ReviewSummary;
