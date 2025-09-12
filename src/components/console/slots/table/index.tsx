import { Separator } from "@/components/ui/separator";
import TableBlock from "@/components/blocks/table";
import { Table as TableSlotType } from "@/types/slots/table";
import Toolbar from "@/components/blocks/toolbar";
import { Badge } from "@/components/ui/badge";

export default function ({ ...table }: TableSlotType) {
  return (
    <div className="space-y-3">
      <div className="h-10 flex items-center pl-3">
        <h3 className="text-base font-bold leading-none flex items-center gap-2">
          <span>{table.title}</span>
          {Array.isArray(table.data) && (
            <Badge variant="secondary" className="rounded-full bg-gray-600 text-white border-transparent px-2.5 py-0.5">
              {table.data.length}
            </Badge>
          )}
        </h3>
      </div>
      {table.tip && (
        <p className="text-sm text-muted-foreground">
          {table.tip.description || table.tip.title}
        </p>
      )}
      {table.toolbar && <Toolbar items={table.toolbar.items} />}
      <Separator />
      <TableBlock {...table} />
    </div>
  );
}
