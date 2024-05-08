import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import {
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { MoreHorizontal } from 'lucide-react';

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
  const navigate = useNavigate();
  const handleRowClick = (requirementId: string) => {
    navigate(`/requirement/${requirementId}`);
  };

  const columns: ColumnDef<RQData>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'approvalStatus',
        header: '승인여부',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'lockStatus',
        header: '잠금여부',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'requirementId',
        header: '항목ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'requirementName',
        header: '요구사항이름',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: '상세설명',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'assignee',
        header: '담당자',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'author',
        header: '작성자',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'currentVersion',
        header: '현재버전',
        cell: (info) => info.getValue(),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const requirement = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel></DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    console.log(`Delete ${requirement.requirementId}`)
                  }>
                  삭제하기
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    console.log(`이전 버전확인 ${requirement.requirementId}`)
                  }>
                  버전확인
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      Array(5)
        .fill({})
        .map((_, idx) => ({
          approvalStatus: 'N',
          lockStatus: 'N',
          requirementId: `OLD00${idx + 1}`,
          requirementName: '로그인',
          description: '사용자는 서비스를 사용 하기 위해 로그인한다.',
          assignee: '최지원',
          author: '최지원',
          currentVersion: `v1.${idx + 1}`,
        })),
    [],
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // 편집 상태가 변경될 때마다 실행되는 useEffect

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

  const handleAddRequirementItem = () => {
    console.log('요구사항 항목의 추가');
  };

  return (
    <div className='p-8 text-center'>
      {/* 프로젝트 제목 및 기간 시작 */}
      <p className='mb-4 text-2xl font-bold'>올리브올드 쇼핑몰 제작 프로젝트</p>
      <p className='mb-8 text-lg'>2024.04.25. ~ 2024.05.25.</p>
      {/* 프로젝트 제목 및 기간 끝 */}
      <br />
      {/* 테이블 시작 */}
      <div className='rounded-md border'>
        <div className='flex items-center px-5 py-5'>
          <Input
            placeholder='요구사항이름으로 필터링 가능합니다.'
            value={
              (table
                .getColumn('requirementName')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('requirementName')
                ?.setFilterValue(event.target.value)
            }
            className='max-w-sm text-lg'
          />
          {/* 테이블 시작 */}
          <div className='ml-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='text-lg'>
                  컬럼선택
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide() && column.id !== 'actions',
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='text-center text-lg font-semibold'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='text-base'>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  role='button'
                  className='cursor-pointer hover:bg-gray-100'
                  onClick={() => handleRowClick(row.original.requirementId)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <br />
      <div className='flex justify-start'>
        <Button className='text-base' onClick={handleAddRequirementItem}>
          항목 추가
        </Button>
      </div>
      <div className='flex items-center justify-center space-x-2 py-4'>
        <Button
          className='text-base'
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          이전 페이지
        </Button>
        <div />
        <div />
        <div />
        <Button
          className='text-base'
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          다음 페이지
        </Button>
      </div>

      <div className='flex-1 text-sm text-muted-foreground'>
        {table.getFilteredRowModel().rows.length} 개 중{' '}
        {table.getFilteredSelectedRowModel().rows.length} 개 선택됨.
      </div>
    </div>
  );
};

export default RQPage;
