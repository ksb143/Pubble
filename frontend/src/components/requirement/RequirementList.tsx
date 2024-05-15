// 1. react 관련
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library 관련
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
import { MoreHorizontal } from 'lucide-react';
// 3. api 관련
import { getRequirement } from '@/apis/project.ts';
// 4. store 관련
// import usePageInfoStore from '@/stores/pageInfoStore.ts';
// 5. components 관련
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
// Requirement type 정의: 특정 프로젝트의 모든 요구사항 데이터를 아우르는 type
export type Requirement = {
  description: string; // 개별 요구사항 상세설명
  requirementId: number; // 개별 요구사항 pk
  orderIndex: number; // 개별 요구사항 인덱스 번호
  version: string; // 개별 요구사항의 버전
  isLock: 'u' | 'l'; // 개별 요구사항 잠금 여부
  approval: 'u' | 'h' | 'a'; // 개별 요구사항 승인 여부
  approvalComment: string; // 개별 요구사항 승인 코멘트
  code: string; // 개별 요구사항 코드
  requirementName: string; // 개별 요구사항 이름
  detail: string; // 개별 요구사항 상세설명
  manager: {
    userId: number; // 개별 요구사항 담당자의 사용자 아이디
    name: string; // 개별 요구사항 담당자의 이름
    employeeId: string; // 개별 요구사항 담당자의 사번
    department: string; // 개별 요구사항 담당자의 부서
    position: string; // 개별 요구사항 담당자의 직위
    role: string; // 개별 요구사항 담당자의 역할
    isApprovable: 'y' | 'n'; // 개별 요구사항 담당자의 승인 가능 여부
    profileColor: string; // 개별 요구사항 담당자의 프로필 색상
  };
};

interface RequirementListProps {
  projectId: string; // 프로젝트 pk
  projectCode: string; // 프로젝트 코드
  projectName: string; // 프로젝트 이름
}
// cloumn 정의
export const columns: ColumnDef<Requirement>[] = [
  // useMemo는 계산 결과를 메모리에 저장(캐싱)하여, 컬럼 정의를 한번만 하게하고, 불필요한 리렌더링을 방지합니다.

  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
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
              onClick={
                () => console.log(`Delete ${requirement.requirementId}`) // 함수 추가 후 콘솔 로그 삭제예정
              }>
              삭제하기
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={
                () => console.log(`이전 버전확인 ${requirement.requirementId}`) // 함수 추가 후 콘솔 로그 삭제예정
              }>
              버전확인
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// RequirementList: 특정 프로젝트의 요구사항을 개괄적으로 보는 컴포넌트
const RequirementList = ({
  projectId,
  projectCode,
  projectName,
}: RequirementListProps) => {
  // store에서 requirementId,requirementCode,requirementName를 업데이트 하는 함수를 가져옴
  // const { setRequirementId, setRequirementCode, setRequirementName } =
  //   usePageInfoStore();
  // const { requirementId, requirementCode, requirementName } = usePageInfoStore.getState()
  // // 스토어에 잘 저장되었는지 체크
  // console.log('zustand 스토어에 잘 저장되었는지 체크')
  // console.log("requirementId : ", requirementId)
  // console.log("requirementCode : ", requirementCode)
  // console.log("requirementName : ", requirementName)

  // navigate
  const navigate = useNavigate();
  // useState를 통한 상태변화 관리 들어가기
  const [requirements, setRequirements] = useState<Requirement[]>([]); // 요구사항의 목록
  const [sorting, setSorting] = useState<SortingState>([]); // 정렬 상태
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // 필터링 상태
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}); // 열 표시 상태
  const [rowSelection, setRowSelection] = useState({}); // 행 선택 상태
  // 테이블 상태
  const table = useReactTable({
    data: requirements,
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
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await getRequirement(projectId, projectCode);
        if (response.data && response.data.length > 0) {
          const requirementData = response.data.map((req: Requirement) => ({
            // 구조분해할당을 사용하여 직접 필드를 할당
            requirementId: req.requirementId,
            orderIndex: req.orderIndex,
            version: req.version,
            isLock: req.isLock,
            approval: req.approval,
            approvalComment: req.approvalComment,
            code: req.code,
            requirementName: req.requirementName,
            manager: {
              name: req.manager.name,
              employeeId: req.manager.employeeId,
              department: req.manager.department,
              position: req.manager.position,
              role: req.manager.role,
              isApprovable: req.manager.isApprovable,
              profileColor: req.manager.profileColor,
            },
          }));

          // 첫번째 requirementId, requirementCode, requirementName를 가져와서 업데이트
          // setRequirementId(response.data[0].requirementId);
          // setRequirementCode(response.data[0].code);
          // setRequirementName(response.data[0].requirementName);

          setRequirements(requirementData);
        } else {
          setRequirements([]); // 데이터가 없는 경우 빈 배열 할당
        }
      } catch (error) {
        console.error('Failed to fetch requirements:', error);
        setRequirements([]); // 에러 처리
      }
    };

    fetchRequirements();
  }, [
    projectId,
    projectCode,
    // setRequirementId,
    // setRequirementCode,
    // setRequirementName,
    setRequirements,
  ]);

  const handleRowClick = (requirement: Requirement) => {
    const { requirementId, code } = requirement;
    if (!requirementId) {
      console.error('Invalid requirement data');
      return; // 유효하지 않은 데이터에 대해 처리 중단
    }
    // console.log("requirementId : ", requirementId)
    // console.log("requirementCode : ", code)
    navigate(`/project/${projectCode}/requirement/${code}`, {
      state: { requirementId },
    });
  };

  // const handleAddRequirement = () => {
  //   console.log('요구사항 항목의 추가');
  // };
  // const handleDeleteRequirement = () => {
  //   console.log('요구사항 항목의 삭제');
  // };
  // const handleVersionCheck = () => {
  //   console.log('요구사항 항목의 버전확인');
  // };
  return (
    <div className='p-8 text-center'>
      {/* 프로젝트 제목 및 기간 시작 */}
      <p className='mb-4 text-2xl font-bold'>
        {projectName || '예시 프로젝트 제목'}
      </p>
      <p className='mb-8 text-lg'>프로젝트 기간</p>
      {/* 프로젝트 제목 및 기간 끝 */}
      <br />
      {/* 테이블 시작 */}
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
                  className='cursor-pointer hover:bg-gray-100'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => handleRowClick(row.original)}>
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
        {/* <Button className='text-base' onClick={handleAddRequirementItem}>
          항목 추가
        </Button> */}
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

export default RequirementList;
