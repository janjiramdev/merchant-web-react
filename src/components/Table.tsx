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

export default function Table<T>({
  columns,
  rows,
  rowKey,
  renderActions,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="table-fixed w-full border border-gray-300 divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-center text-gray-800 uppercase tracking-wider whitespace-nowrap">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={String(row[rowKey])} className="hover:bg-gray-50">
              {columns.map((col) => {
                if (col.key === 'actions') {
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
                }
                return (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 text-center border border-gray-300"
                  >
                    {String(row[col.key as keyof T] ?? '')}
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
