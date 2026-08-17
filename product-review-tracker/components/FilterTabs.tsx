import type { ProductFilter } from "../src/App";

type FilterTabsProps = {
  filter: ProductFilter;
  onFilterChange: (filter: ProductFilter) => void;
};

const filters: ProductFilter[] = ["all", "new", "reviewed"];

function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  return (
    <div
      className='inline-flex overflow-hidden rounded-lg border border-slate-300'
      aria-label='Filter products by review status'
    >
      {filters.map((filterOption) => {
        const isActive = filterOption === filter;

        return (
          <button
            key={filterOption}
            type='button'
            className={
              isActive
                ? "bg-blue-600 px-4 py-2 font-medium capitalize text-white"
                : "bg-white px-4 py-2 font-medium capitalize text-slate-700 hover:bg-slate-50"
            }
            aria-pressed={isActive}
            onClick={() => onFilterChange(filterOption)}
          >
            {filterOption}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
