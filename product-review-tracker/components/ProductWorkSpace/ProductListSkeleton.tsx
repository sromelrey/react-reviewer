function ProductListSkeleton() {
  return (
    <div className='space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
      <p className='font-medium text-blue-700'>Loading products...</p>

      {[0, 1, 2].map((item) => (
        <div key={item} className='flex animate-pulse items-center gap-4 py-2'>
          <div className='h-16 w-16 rounded-md bg-slate-200' />
          <div className='space-y-2'>
            <div className='h-4 w-48 rounded bg-slate-200' />
            <div className='h-3 w-28 rounded bg-slate-100' />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductListSkeleton;
