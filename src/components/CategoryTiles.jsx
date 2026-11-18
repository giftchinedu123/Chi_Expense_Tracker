import { formatCurrency } from '../utils/formatCurrency';

export default function CategoryTiles({ categories, monthLabel }) {
  return (
    <section className="panel-section" aria-labelledby="monthly-expenses-heading">
      <div className="section-header">
        <h2 id="monthly-expenses-heading" className="section-title">
          Monthly Expenses
        </h2>
      </div>

      {categories.length === 0 ? (
        <div className="inline-empty">
          <p>No expense categories for {monthLabel}.</p>
        </div>
      ) : (
        <div className="category-tiles-grid">
          {categories.map((item) => (
            <article key={item.category} className="category-tile">
              <span className="category-tile-name">{item.category}</span>
              <strong className="category-tile-amount tabular-nums">
                {formatCurrency(item.total)}
              </strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
