// 1. react 관련
import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// 2. library: react-table
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
// 2. library: lucide-react
import { MoreHorizontal } from 'lucide-react';
// 3. api
// 4. store
// 5. components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

// TableData: 테이블 데이터 타입
interface TableData {
  approvalStatus: string;
  requirementId: string;
  requirementName: string;
  description: string;
  assignee: string;
  author: string;
  currentVersion: string;
}
// ProjectPage: 특정 프로젝트의 요구사항을 개괄적으로 볼 수 있는 페이지
const ProjectPage = () => {
  const { projectId } = useParams();
  
  const columns: ColumnDef<TableData>[] = useMemo( 
    // useMemo는 계산 결과를 메모리에 저장(캐싱)하여, 컬럼 정의를 한번만 하게하고, 불필요한 리렌더링을 방지합니다.
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
                    console.log(`Delete ${requirement.requirementId}`) // 함수 추가 후 콘솔 로그 삭제예정
                  }>
                  삭제하기
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    console.log(`이전 버전확인 ${requirement.requirementId}`) // 함수 추가 후 콘솔 로그 삭제예정
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
  // 테이블 데이터
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
  // 테이블 상태 관리
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<TableData>({
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
      <p className='mb-4 text-2xl font-bold'>{projectId}</p>
      <p className='mb-8 text-lg'>프로젝트 기간</p>
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
                <Link to={`requirement/${row.original.requirementId}`}>
                <TableRow
                  key={row.id}
                  role='button'
                  className='cursor-pointer hover:bg-gray-100'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                </Link>
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

export default ProjectPage;
