import { useState, type ReactNode } from 'react';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
}

interface TableProps<T> {
  columns: readonly Column<T>[];
  rows: T[];
  rowKey: keyof T;
  renderActions?: (row: T, index: number) => ReactNode;
}

const IdCell = ({ value }: { value: string }) => {
  const [showFullContent, setShowFullContent] = useState<boolean>(false);

  return (
    <span
      onClick={() => setShowFullContent((prev) => !prev)}
      className="cursor-pointer break-all whitespace-normal "
      title={value}
    >
      {showFullContent ? value.trim() : value.trim().slice(0, 8) + '...'}
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

        {rows.length > 0 ? (
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
                  let displayValue: ReactNode;

                  if (
                    (col.key === '_id' || col.key === 'productId') &&
                    typeof rawValue === 'string'
                  )
                    displayValue = <IdCell value={rawValue} />;
                  else if (
                    col.key === 'adjustType' &&
                    typeof rawValue === 'string'
                  )
                    displayValue = String(rawValue.toUpperCase() ?? '-');
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
        ) : undefined}
      </table>
    </div>
  );
}
