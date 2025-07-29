import { useState } from 'react';

type Column<T> = {
  key: keyof T | 'actions';
  label: string;
};

type TableProps<T> = {
  columns: readonly Column<T>[];
  rows: T[];
  rowKey: keyof T;
  renderActions?: (row: T, index: number) => React.ReactNode;
};

const IdCell = ({ value }: { value: string }) => {
  const [showFull, setShowFull] = useState(false);
  const handleClick = () => setShowFull((prev) => !prev);
  const displayValue = showFull ? value : value.slice(0, 8) + '...';

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer break-all whitespace-normal "
      title={value}
    >
      {displayValue}
    </span>
  );
};

export default function Table<T>({
  columns,
  rows,
  rowKey,
  renderActions,
}: TableProps<T>) {
  const cellClass =
    'px-4 py-3 text-center border border-gray-300 truncate max-w-[150px] whitespace-nowrap overflow-hidden';

  return (
    <div className="overflow-x-auto rounded-lg shadow ">
      <table className="table-fixed w-full border border-gray-300 divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-center text-gray-800 uppercase tracking-wider whitespace-nowrap ">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-center text-sm"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr
              key={row[rowKey] ? String(row[rowKey]) : `row-${index}`}
              className="hover:bg-gray-50"
            >
              {columns.map((col) => {
                if (col.key === 'actions')
                  return (
                    <td
                      key={'actions'}
                      className="px-6 py-4 text-center border border-gray-300"
                    >
                      {renderActions ? (
                        renderActions(row, index)
                      ) : (
                        <div className="flex justify-center gap-2"></div>
                      )}
                    </td>
                  );

                const rawValue = row[col.key as keyof T];
                let displayValue: React.ReactNode;

                if (col.key === 'id' && typeof rawValue === 'string')
                  displayValue = <IdCell value={rawValue} />;
                else if (typeof rawValue === 'object' && rawValue !== null)
                  if ('_id' in rawValue && typeof rawValue._id === 'string')
                    displayValue = <IdCell value={rawValue._id} />;
                  else if ('id' in rawValue && typeof rawValue.id === 'string')
                    displayValue = <IdCell value={rawValue.id} />;
                  else displayValue = JSON.stringify(rawValue);
                else displayValue = String(rawValue ?? '-');

                return (
                  <td key={String(col.key)} className={cellClass}>
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
