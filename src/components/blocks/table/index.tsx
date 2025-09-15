import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableColumn } from "@/types/blocks/table";
import TableItemImage from "./image";
import TableItemLabel from "./label";
import TableItemTime from "./time";
import Copy from "./copy";

export default function TableComponent({
  columns,
  data,
  emptyMessage,
  variant,
}: {
  columns?: TableColumn[];
  data?: any[];
  emptyMessage?: string;
  variant?: "bullish" | "bearish" | "neutral";
}) {
  if (!columns) {
    columns = [];
  }

  const getRowBgClass = (rowIndex: number): string => {
    if (variant === "bullish") {
      // Green alternating rows - darker in dark mode
      return rowIndex % 2 === 0 
        ? "bg-[#d1e7dd] dark:bg-emerald-900/20" 
        : "bg-[#c7dbd2] dark:bg-emerald-900/30";
    }
    if (variant === "bearish") {
      // Red alternating rows - darker in dark mode
      return rowIndex % 2 === 0 
        ? "bg-[#F7D7DA] dark:bg-red-900/20" 
        : "bg-[#eccccf] dark:bg-red-900/30";
    }
    // Neutral gray alternating rows
    return rowIndex % 2 === 0 ? "bg-muted/40" : "bg-muted/20";
  };

  return (
    <Table className="w-full">
      <TableHeader className="[&_tr]:border-b-2 [&_tr]:border-black [&_tr]:dark:border-white">
        <TableRow className="rounded-md">
          {columns &&
            columns.map((item: TableColumn, idx: number) => {
              return (
                <TableHead
                  key={idx}
                  className={`${item.className || ""} font-bold text-foreground`}
                >
                  {item.title}
                </TableHead>
              );
            })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((item: any, idx: number) => (
            <TableRow key={idx} className={`h-12 ${getRowBgClass(idx)} ${
              variant === "bullish" || variant === "bearish" 
                ? "text-gray-900 dark:text-gray-100" 
                : ""
            }`}>
              {columns &&
                columns.map((column: TableColumn, iidx: number) => {
                  const value = item[column.name as keyof typeof item];

                  const content = column.callback
                    ? column.callback(item)
                    : value;

                  let cellContent = content;

                  if (column.type === "image") {
                    cellContent = (
                      <TableItemImage
                        value={value}
                        options={column.options}
                        className={column.className}
                      />
                    );
                  } else if (column.type === "time") {
                    cellContent = (
                      <TableItemTime
                        value={value}
                        options={column.options}
                        className={column.className}
                      />
                    );
                  } else if (column.type === "label") {
                    cellContent = (
                      <TableItemLabel
                        value={value}
                        options={column.options}
                        className={column.className}
                      />
                    );
                  } else if (column.type === "copy" && value) {
                    cellContent = <Copy text={value}>{content}</Copy>;
                  }

                  return (
                    <TableCell key={iidx} className={column.className}>
                      {cellContent}
                    </TableCell>
                  );
                })}
            </TableRow>
          ))
        ) : (
          <TableRow className="">
            <TableCell colSpan={columns.length}>
              <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                <p>{emptyMessage}</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
