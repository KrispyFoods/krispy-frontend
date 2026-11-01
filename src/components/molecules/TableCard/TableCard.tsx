import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

export interface TableColumn {
  label: string;
  className?: string;
  /** Visually hide the label (action columns) but keep it for screen readers. */
  srOnly?: boolean;
}

interface TableCardProps {
  title: string;
  columns: TableColumn[];
  isEmpty: boolean;
  emptyText: string;
  /** The <TableRow>s. */
  children: ReactNode;
}

/** Card + table with a heading row and an empty state that spans every column. */
export function TableCard({ title, columns, isEmpty, emptyText, children }: TableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.label} className={column.className}>
                  {column.srOnly ? <span className="sr-only">{column.label}</span> : column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              children
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
