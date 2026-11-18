import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompactNaira, formatCurrency } from '../utils/formatCurrency';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const point = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-date">{point.fullDate}</p>
      <p className="chart-tooltip-value tabular-nums">
        {formatCurrency(point.total)}
      </p>
    </div>
  );
}

export default function ExpenseChart({ data, hasExpenses, monthLabel }) {
  return (
    <section className="panel-section" aria-labelledby="expenses-chart-heading">
      <div className="section-header">
        <h2 id="expenses-chart-heading" className="section-title">
          Expenses Statistics
        </h2>
      </div>

      {!hasExpenses ? (
        <div className="chart-empty">
          <p>No expenses recorded for {monthLabel}.</p>
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={data}
              margin={{ top: 12, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="monochromeAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#111111" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#111111" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#ececec"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#737373', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}
                minTickGap={16}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCompactNaira}
                tick={{ fill: '#737373', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}
                width={48}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#d4d4d4', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#111111"
                strokeWidth={2}
                fill="url(#monochromeAreaFill)"
                activeDot={{ r: 4, fill: '#111111', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
