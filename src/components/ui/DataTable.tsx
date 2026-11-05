import React from 'react';
import { cn } from '@/lib/utils';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="p-5 text-center vyavsa-table-wrapper">
        <LoadingSpinner size="md" label="Fetching ledger records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={cn('table-responsive vyavsa-table-wrapper', className)}>
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-end',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={keyExtractor(item)}>
              {columns.map(col => (
                <td
                  key={col.key}
                  className={cn(
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-end',
                    col.className
                  )}
                >
                  {col.render
                    ? col.render(item, rowIdx)
                    : (((item as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
