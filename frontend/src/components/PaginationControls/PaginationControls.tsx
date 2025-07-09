import type { Table } from '@tanstack/react-table';
import type { URLRecord } from '../../types/types.ts';

interface Props {
  table: Table<URLRecord>;
}

const PaginationControls = ({ table }: Props) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const rowCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
      <div className="text-sm text-gray-700">
        {rowCount > 0 ? (
          <>
            Showing <strong>{pageIndex * pageSize + 1}</strong> to{' '}
            <strong>{pageIndex * pageSize + table.getRowModel().rows.length}</strong> of{' '}
            <strong>{rowCount}</strong> results
          </>
        ) : (
          'No pages'
        )}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`px-3 py-1 rounded ${
            table.getCanPreviousPage()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Prev
        </button>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`px-3 py-1 rounded ${
            table.getCanNextPage()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>

        <span className="text-sm">
          Page <strong>{pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>
        </span>

        <input
          type="number"
          min={1}
          max={table.getPageCount()}
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = Number(e.target.value) - 1;
            table.setPageIndex(page);
          }}
          className="w-16 border px-2 py-1 rounded text-sm"
        />

        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border px-2 py-1 rounded text-sm"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;
