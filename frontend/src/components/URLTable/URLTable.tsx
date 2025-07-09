import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { matchSorter } from 'match-sorter';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useURLs from '../../hooks/useUrls.ts';
import api from '../../api/api';
import { toast } from 'react-toastify';
import type { URLRecord } from '../../types/types.ts';
import Spinner from '../Spinner/Spinner';
import PaginationControls from '../PaginationControls/PaginationControls.tsx';

const URLTable = () => {
  const { urls, fetch, loading } = useURLs();
  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Memoize data to avoid triggering resets on re-render
  const data = useMemo(() => urls, [urls]);

  const columns: ColumnDef<URLRecord>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(input) => {
              if (input)
                input.indeterminate =
                  table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: 'url',
        header: 'URL',
        cell: (info) => (
          <span
            className="text-blue-600 dark:text-blue-400 underline cursor-pointer break-all"
            onClick={() => navigate(`/url/${info.row.original.id}`)}
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'results.html_version',
        header: 'HTML Version',
      },
      {
        accessorKey: 'results.title',
        header: 'Title',
      },
      {
        accessorKey: 'results.num_internal_links',
        header: 'Internal Links',
      },
      {
        accessorKey: 'results.num_external_links',
        header: 'External Links',
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue: string) =>
      matchSorter([row.getValue(columnId)], filterValue).length > 0,
  });

  const rerunSelected = async () => {
    const selectedRows = table.getSelectedRowModel().rows;

    for (const row of selectedRows) {
      const id = row.original?.id;

      if (!id) {
        toast.error('Missing or invalid ID, skipping...');
        continue;
      }

      try {
        await api.post(`/urls/${id}/rerun`);
        toast.success(`Requeued ID ${id}`);
      } catch {
        toast.error(`Failed to requeue ID ${id}`);
      }
    }

    fetch(); // Re-fetch after re-running
  };

  const deleteSelected = async () => {
    const selectedRows = table.getSelectedRowModel().rows;

    for (const row of selectedRows) {
      const id = row.original?.id;

      if (!id) {
        toast.error('Missing or invalid ID, skipping...');
        continue;
      }

      try {
        await api.delete(`/urls/${id}`);
        toast.success(`Deleted ID ${id}`);
      } catch (err) {
        toast.error(`Failed to delete ID ${id}`);
      }
    }

    fetch(); // Re-fetch after deletion
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded p-4 bg-white dark:bg-zinc-800 shadow transition-colors duration-300">
      {/* Filter & Action Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Global Search"
          className="border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 p-2 rounded w-full md:w-64 transition-colors duration-300"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors duration-200"
            onClick={rerunSelected}
          >
            Re-run Selected
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors duration-200"
            onClick={deleteSelected}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Table Content */}
      {table.getRowModel().rows.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300">No data available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded overflow-hidden">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-zinc-100 dark:bg-zinc-700 text-left">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 border-t border-zinc-100 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4">
        <PaginationControls table={table} />
      </div>
    </div>
  );
};

export default URLTable;
