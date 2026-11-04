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
      <div className="p-5 text-center bg-white rounded border">
        <LoadingSpinner size="md" label="Loading data..." />
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
    <div className={cn('table-responsive bg-white rounded border shadow-sm', className)}>
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-3 py-3 small fw-bold text-uppercase text-muted border-bottom',
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
                    'px-3 py-3 text-secondary',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-end',
                    col.className
                  )}
                >
                  {col.render
                    ? col.render(item, rowIdx)
                    : (((item as Record<string, unknown>)[col.key] as React.ReactNode) ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
