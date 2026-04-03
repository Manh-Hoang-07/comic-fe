"use client";

import { ReactNode } from "react";

interface DataTableProps {
  isAllSelected?: boolean;
  onToggleSelectAll?: () => void;
  children: ReactNode;
  thead?: ReactNode;
  tbody?: ReactNode;
  actions?: ReactNode;
  filter?: ReactNode;
  pagination?: ReactNode;
}

export default function DataTable({
  isAllSelected = false,
  onToggleSelectAll,
  children,
  thead,
  tbody,
  actions,
  filter,
  pagination,
}: DataTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      {/* Action bar */}
      {(actions || filter) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
          <div className="flex flex-wrap items-center gap-2">{filter}</div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-fixed text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold text-sm uppercase tracking-wider border-b border-gray-200">
              <th className="w-6 px-1 py-1 text-center align-middle">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="accent-indigo-500 w-5 h-5 rounded border-gray-300 focus:ring-indigo-500"
                />
              </th>
              {thead}
              <th className="w-32 px-3 py-3 text-center align-middle">Thao tác</th>
            </tr>
          </thead>
          <tbody>{tbody || children}</tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {pagination}
        </div>
      )}
    </div>
  );
}


