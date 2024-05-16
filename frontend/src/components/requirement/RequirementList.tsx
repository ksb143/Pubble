// 1. react 관련
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library 관련
// import { FiMoreHorizontal } from 'react-icons/fi';
// 3. api 관련
import { getLatestRequirementVersion } from '@/apis/project';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component 관련
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
} from '@/components/ui/table';
import {
  // DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';

// Person 타입 정의
type Person = {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string;
  isApprovable: 'y' | 'n';
  profileColor: string;
};

type Detail = {
  requirementDetailId: number;
  content: string;
  status: 'u' | 'd';
};

type Summary = {
  requirementId: number;
  orderIndex: number;
  version: string;
  isLock: 'u' | 'l';
  approval: 'u' | 'h' | 'a';
  approvalComment: string | null;
  detail: Detail[];
  manager: Person;
  targetUse: string;
  createdAt: string;
  author: Person;
  requirementName: string;
  code: string;
};

type Requirement = {
  projectId: number;
  projectTitle: string;
  startAt: string;
  endAt: string;
  status: string;
  code: string;
  people: Person[];
  requirementSummaryDtos: Summary[];
};

// RequirementList component의 props 정의
interface RequirementListProps {
  pId: number;
  pCode: string;
  pName: string;
}

// RequirementList component의 columns 정의
export const columns: ColumnDef<Summary>[] = [
  {
    accessorKey: 'approval',
    header: '승인여부',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'isLock',
    header: '잠금여부',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'code',
    header: '요구사항 코드',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'requirementName',
    header: '요구사항 이름',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'detail',
    header: '상세설명',
    cell: (info) => {
      const details = info.getValue() as Detail[];
      return details ? details.map((d) => d.content).join(', ') : '';
    },
  },
  {
    accessorKey: 'manager.name',
    header: '담당자',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'author.name',
    header: '작성자',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'version',
    header: '현재 버전',
    cell: (info) => info.getValue(),
  },
];
// 액션 컬럼
// {
//   id: 'actions',
//   cell: ({ row }) => {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant='ghost' className='h-8 w-8 p-0'>
//             <span className='sr-only'>Open menu</span>
//             <FiMoreHorizontal className='h-4 w-4' />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align='end'>
//           <DropdownMenuLabel></DropdownMenuLabel>
//           <DropdownMenuItem
//             onClick={
//               () => console.log(`Delete 함수 추가 후 콘솔 로그 삭제예정`) // 함수 추가 후 콘솔 로그 삭제예정
//             }>
//             삭제하기
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={
//               () =>
//                 console.log(`이전 버전확인 함수 추가 후 콘솔 로그 삭제예정`) // 함수 추가 후 콘솔 로그 삭제예정
//             }>
//             버전확인
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   },
// },

const RequirementList = ({ pId, pCode, pName }: RequirementListProps) => {
  const { setPageType } = usePageInfoStore();
  const navigate = useNavigate();
  // useState를 통한 상태변화 관리 들어가기
  // 요구사항의 목록
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  // 정렬 상태
  const [sorting, setSorting] = useState<SortingState>([]);
  // column 필터링 상태
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // column 보이기 상태
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // row 선택 상태
  const [rowSelection, setRowSelection] = useState({});
  // table 상태
  const table = useReactTable({
    data: requirements.flatMap((r) => r.requirementSummaryDtos),
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
  // useEffect를 활용한... 사용자의 요구사항 목록 화면 UI 갱신
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await getLatestRequirementVersion(pId);
        console.log(response);

        if (response.data) {
          const requirementData: Requirement = {
            projectId: response.data.projectId,
            projectTitle: response.data.projectTitle,
            startAt: response.data.startAt,
            endAt: response.data.endAt,
            status: response.data.status,
            code: response.data.code,
            people: response.data.people.map((person: any) => ({
              name: person.name,
              employeeId: person.employeeId,
              department: person.department,
              position: person.position,
              role: person.role,
              isApprovable: person.isApprovable,
              profileColor: person.profileColor,
            })),
            requirementSummaryDtos: response.data.requirementSummaryDtos.map(
              (summary: any) => ({
                requirementId: summary.requirementId,
                orderIndex: summary.orderIndex,
                version: summary.version,
                isLock: summary.isLock,
                approval: summary.approval,
                approvalComment: summary.approvalComment,
                detail: summary.details.map((detail: any) => ({
                  requirementDetailId: detail.requirementDetailId,
                  content: detail.content,
                  status: detail.status,
                })),
                manager: {
                  name: summary.manager.name,
                  employeeId: summary.manager.employeeId,
                  department: summary.manager.department,
                  position: summary.manager.position,
                  role: summary.manager.role,
                  isApprovable: summary.manager.isApprovable,
                  profileColor: summary.manager.profileColor,
                },
                targetUse: summary.targetUse,
                createdAt: summary.createdAt,
                author: {
                  name: summary.author.name,
                  employeeId: summary.author.employeeId,
                  department: summary.author.department,
                  position: summary.author.position,
                  role: summary.author.role,
                  isApprovable: summary.author.isApprovable,
                  profileColor: summary.author.profileColor,
                },
                requirementName: summary.requirementName,
                code: summary.code,
              }),
            ),
          };

          setRequirements([requirementData]);
        } else {
          setRequirements([]);
        }
      } catch (error) {
        console.error('Failed to fetch requirements:', error);
        setRequirements([]);
      }
    };
    fetchRequirements();
  }, [pId, pCode]);

  useEffect(() => {
    if (requirements.length > 0) {
      console.log('프로젝트 시작기간: ', requirements[0]?.startAt);
      console.log('프로젝트 종료기간: ', requirements[0]?.endAt);
    }
  }, [requirements]);

  const handleRowClick = (summary: Summary) => {
    const { code } = summary;
    const rCode = code;
    const rId = summary.requirementId;
    if (!rId) {
      console.error('Invalid requirement data');
      return;
    }
    setPageType('requirement', {
      requirementId: rId,
    });
    navigate(`/project/${pCode}/requirement/${rCode}`);
  };

  return (
    <div className='p-8 text-center'>
      <p className='mb-4 text-2xl font-bold'>{pName || '예시 프로젝트 제목'}</p>
      <p className='mb-8 text-lg'>
        {requirements.length > 0 &&
          `${new Date(requirements[0].startAt).toLocaleDateString('ko-KR')} ~ ${new Date(requirements[0].endAt).toLocaleDateString('ko-KR')}`}
      </p>
      <div className='rounded-md border'>
        <div className='flex items-center px-5 py-5'>
          <Input
            placeholder='요구사항 이름을 입력해주세요.'
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
                  onClick={() => handleRowClick(row.original)}
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
      <div className='flex items-center justify-center space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          이전 페이지
        </Button>
        <Button
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

export default RequirementList;
