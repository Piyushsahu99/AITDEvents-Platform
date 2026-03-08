import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ContentTableProps {
  columns: Column[];
  data: any[];
  onDelete?: (id: string) => void;
  onEdit?: (row: any) => void;
  loading?: boolean;
}

const ContentTable = ({ columns, data, onDelete, onEdit, loading }: ContentTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No items found.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) => (
              <TableHead key={col.key} className="font-semibold">
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead className="w-24">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(row.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContentTable;

export const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    live: "bg-success/10 text-success border-success/20",
    active: "bg-success/10 text-success border-success/20",
    published: "bg-success/10 text-success border-success/20",
    draft: "bg-warning/10 text-warning border-warning/20",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    closed: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge variant="outline" className={variants[status] || ""}>
      {status}
    </Badge>
  );
};
