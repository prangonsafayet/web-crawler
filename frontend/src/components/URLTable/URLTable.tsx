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

  const data = useMemo(() => urls, [urls]);

  const columns: ColumnDef<URLRecord>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => <input type="checkbox" />,
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
            className="text-blue-600 underline cursor-pointer"
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
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue: string) => {
      return matchSorter([row.getValue(columnId)], filterValue).length > 0;
    },
  });

  const rerunSelected = async () => {
    const ids = Object.keys(rowSelection);
    for (const id of ids) {
      try {
        await api.post(`/urls/${id}/rerun`);
        toast.success(`Requeued ID ${id}`);
      } catch {
        toast.error(`Failed to requeue ID ${id}`);
      }
    }
    fetch();
  };

  const deleteSelected = async () => {
    const ids = Object.keys(rowSelection);
    for (const id of ids) {
      try {
        await api.delete(`/urls/${id}`);
        toast.success(`Deleted ID ${id}`);
      } catch {
        toast.error(`Failed to delete ID ${id}`);
      }
    }
    fetch();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="border rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Global Search"
          className="border p-2 rounded w-64"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={rerunSelected}>
            Re-run Selected
          </button>
          <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={deleteSelected}>
            Delete Selected
          </button>
        </div>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <div className="text-center text-gray-500">No data available.</div>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border px-3 py-2 text-left bg-gray-100">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PaginationControls table={table} />
    </div>
  );
};

export default URLTable;
