import { useMemo, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState, 
  getSortedRowModel,
  ColumnFiltersState, 
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn-ui/ui/table";

import { 
  DropdownMenuLabel,
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/shadcn-ui/ui/dropdown-menu";

import { 
  Button
} from "@/shadcn-ui/ui/button";

import {
  Input
} from "@/shadcn-ui/ui/input";

import {
  Checkbox
} from "@/shadcn-ui/ui/checkbox";

import { 
  MoreHorizontal,
  ArrowUpDown 
} from "lucide-react";

interface RQData {
  approvalStatus: string;
  requirementId: string;
  requirementName: string;
  description: string;
  assignee: string;
  author: string;
  currentVersion: string;
}

const RQPage = () => {
  const columns: ColumnDef<RQData>[] = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "approvalStatus",
      header: "승인여부",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "lockStatus",
      header: "잠금여부",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "requirementId",
      header: "항목ID",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "requirementName",
      header: ({ column }) => (
        <Button variant="ghost" className="font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          요구사항이름
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "description",
      header: "상세설명",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "assignee",
      header: "담당자",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "author",
      header: "작성자",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "currentVersion",
      header: "현재버전",
      cell: info => info.getValue(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const requirement = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel></DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log(`Edit ${requirement.requirementId}`)}>수정하기</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log(`Delete ${requirement.requirementId}`)}>삭제하기</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log(`이전 버전확인 ${requirement.requirementId}`)}>이전버전 확인</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },}

  ], []);

  const data = useMemo(() => Array(100).fill({}).map((_, idx) => ({
    approvalStatus: "N",
    lockStatus: "N",
    requirementId: `OLD-00${idx + 1}`,
    requirementName: "로그인",
    description: "사용자는 서비스를 사용 하기 위해 로그인한다.",
    assignee: "최지원",
    author: "최지원",
    currentVersion: `v1.${idx + 1}`,
  })), []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});


  const table = useReactTable<RQData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      
    },
  });

  return (
    <div className="p-8 text-center">
      <p className="text-4xl font-bold mb-4">올리브올드 쇼핑몰 제작 프로젝트</p>
      <p className="text-2xl mb-8">2024.04.25. ~ 2024.05.25.</p>
      <div className="rounded-md border">
      <div className="flex items-center py-5 px-5">
      <Input
        placeholder="요구사항이름으로 필터링 가능합니다."
        value={(table.getColumn("requirementName")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("requirementName")?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />
      
      <div className="ml-auto">
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="outline">컬럼</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns().filter((column) => column.getCanHide()&& column.id !== 'actions').map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>

    </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
      <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        Previous
      </Button>
      <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        Next
      </Button>
    </div>
    <div className="flex-1 text-sm text-muted-foreground">
  {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
</div>

    </div>
  );
};

export default RQPage;