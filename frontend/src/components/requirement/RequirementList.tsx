// 1. react 관련
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library 관련
// import { FiMoreHorizontal } from 'react-icons/fi';
// 3. api 관련
import { getLatestRequirementVersion } from '@/apis/project';
// import { requestConfirm } from '@/apis/confirm';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component 관련
// import RequirementAddModal from '@/components/requirement/RequirementAddModal';
// import TestModal from '@/components/requirement/TestModal';
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
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
import { FiMoreHorizontal } from 'react-icons/fi';
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
}

// RequirementList component의 columns 정의
export const columns: ColumnDef<Summary>[] = [
  {
    id: 'lockActions', // 고유 ID로 'actions'를 사용할 수 있습니다.
    header: '요구사항 잠금',
    cell: ({ row }) => {
      const { isLock } = row.original;
      if (isLock === 'u') {
        return (
          <Button
            className='bg-black'
            onClick={() => console.log('해당 요구사항 항목의 잠금 상태 변경')}>
            잠금대기
          </Button>
        );
      } else if (isLock === 'l') {
        return (
          <Button
            className='bg-pubble'
            onClick={() => console.log('잠금 된 요구사항의 confirm 진행')}>
            승인대기
          </Button>
        );
      }
      return null; // 다른 경우에는 아무것도 표시하지 않음
    },
  },
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
    header: 'version',
    cell: (info) => info.getValue(),
  },
  {
    id: 'history',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <FiMoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>확인</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={
                () =>
                  console.log(
                    `이전 버전확인 함수 추가 후 콘솔 로그 삭제예정`,
                    row,
                  ) // 함수 추가 후 콘솔 로그 삭제예정
              }>
              버전 히스토리
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const RequirementList = ({ pId, pCode }: RequirementListProps) => {
  const { setPageType, projectCode } = usePageInfoStore((state) => ({
    setPageType: state.setPageType,
    projectCode: state.projectCode,
    projectName: state.projectName,
    requirementId: state.requirementId,
    requirementCode: state.requirementCode,
    requirementName: state.requirementName,
  }));

  // const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  // useState를 통한 상태변화 관리 들어가기
  // 요구사항의 목록
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  // 정렬 상태
  const [sorting, setSorting] = useState<SortingState>([]);
  // column 필터링 상태
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // column 보이기 상태
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    approval: false, // approval 컬럼을 숨깁니다.
    isLock: false, // isLock 컬럼을 숨깁니다.
  });
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

  // const handleLock = (summary: Summary) => {
  //   // const reqId = summary.requirementId; // 선택된 row의 requirementId
  //   // const reqCode = summary.code; // 선택된 row의 requirementCode
  //   // const reqName = summary.requirementName; // 선택된 row의 requirementName
  // };

  // const handleConfirm = (summary: Summary) => {
  //   // const reqId = summary.requirementId; // 선택된 row의 requirementId
  //   // const reqbody = {
  //   //   projectId: requirements[0].projectId,
  //   //   isLock: summary.isLock,
  //   //   approval: summary.approval,
  //   //   requirementName: summary.requirementName,
  //   //   approvalComment: summary.approvalComment || '',
  //   // };
  //   // requestConfirm(reqId, reqbody);
  // };

  // 사용자의 요구사항 추가 모달 열기
  const handleTestModal = () => {
    console.log('테스트버튼 누름');
  };

  // 특정한 요구사항 row 클릭시, 특정 요구사항에 진입할 수 있도록 하는 함수.
  const handleRowClick = (summary: Summary) => {
    const reqId = summary.requirementId; // 선택된 row의 requirementId
    const reqCode = summary.code; // 선택된 row의 requirementCode
    const reqName = summary.requirementName; // 선택된 row의 requirementName

    if (reqId) {
      // 1. 클릭된 row의 reqId, reqCode, reqName을 store에 넣기
      setPageType('requirement', {
        requirementId: reqId,
        requirementCode: reqCode,
        requirementName: reqName,
      });
      // 2. 요구사항 상세 정보 페이지로 이동하기
      navigate(`/project/${projectCode}/requirement/${reqCode}`);
      return;
    } else {
      console.error('Invalid requirement data');
    }
  };
  return (
    <div className='p-8 text-center'>
      <p className='mb-4 text-2xl font-bold'>
        {requirements[0]?.projectTitle || '예시 프로젝트 제목'}
      </p>

      <p className='mb-8 text-lg'>
        {requirements.length > 0 &&
          `${new Date(requirements[0].startAt).toLocaleDateString('ko-KR')} ~ ${new Date(requirements[0].endAt).toLocaleDateString('ko-KR')}`}
      </p>

      <div className='rounded-md border'>
        <div className='flex'>
          <div>
            <Button
              className='ml-3 mt-3 bg-blue-500 text-base text-white'
              onClick={handleTestModal}>
              요구사항 생성 테스트
            </Button>
            {/* 테스트 모달 */}
            {/* <TestModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
            {/* 요구사항 추가 버튼 */}
          </div>
          <div className='ml-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='mr-3 mt-3 text-base'>
                  정렬
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
                      {/* column을 변수로 쓸때, 한국어 header 값을 추출할 수 있는 방법이 없음. 현재 deprecated 된 방법들 외에는 없음.*/}
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
