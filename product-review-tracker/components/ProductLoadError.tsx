type ProductLoadErrorProps = {
  message: string;
  onRetry: () => void;
};

function ProductLoadError({ message, onRetry }: ProductLoadErrorProps) {
  return (
    <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700'>
      <p className='font-semibold'>Failed to load products</p>
      <p className='mt-2 text-sm'>{message}</p>
      <button
        type='button'
        className='mt-4 rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700'
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

export default ProductLoadError;
