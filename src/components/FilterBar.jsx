import { ALL_CATEGORIES } from '../utils/constants';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onReset,
  hasActiveFilters,
}) {
  return (
    <section className="filter-bar" aria-label="Filter transactions">
      <div className="filter-search-wrap">
        <label htmlFor="filter-search" className="sr-only">
          Search transactions by title
        </label>
        <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true" />
        <input
          id="filter-search"
          type="search"
          className="text-input search-input"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-controls-row">
        <div className="filter-field">
          <label htmlFor="filter-type" className="field-label-sm">
            Type
          </label>
          <select
            id="filter-type"
            className="select-input"
            value={typeFilter}
            onChange={(event) => onTypeChange(event.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="filter-category" className="field-label-sm">
            Category
          </label>
          <select
            id="filter-category"
            className="select-input"
            value={categoryFilter}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">All</option>
            {ALL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="filter-from" className="field-label-sm">
            From
          </label>
          <input
            id="filter-from"
            type="date"
            className="text-input"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter-to" className="field-label-sm">
            To
          </label>
          <input
            id="filter-to"
            type="date"
            className="text-input"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
          />
        </div>

        <div className="filter-reset-wrap">
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            disabled={!hasActiveFilters}
          >
            Reset filters
          </button>
        </div>
      </div>
    </section>
  );
}
