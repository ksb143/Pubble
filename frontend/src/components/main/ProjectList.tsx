// 1. react 관련
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
// 2. library 관련
import { getProject } from "@/apis/project";
// 3. api 관련
import  ProjectAddModal  from "@/components/main/ProjectAddModal"
// 4. store 관련
// 5. component 관련
import { Cell, Header, HeaderGroup, Row, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Project type 정의
export type Project = {
  projectId: string // 프로젝트 pk
  prdId: string // 프로젝트 code
  startAt: string // 프로젝트 시작일
  endAt: string // 프로젝트 종료일
  projectTitle: string // 프로젝트 이름
  people: number // 프로젝트 참여자
  progressRatio: number // 프로젝트 진행률
  status: "in progress" | "complete" | "before start" // 프로젝트 상태
}
// column 정의
export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, 
  {
    accessorKey: "prdId",
    header: "프로젝트 코드",
    cell: ({ row }) => <div>{row.getValue("prdId")}</div>,
  },
  {
    accessorKey: "projectTitle",
    header: "프로젝트 이름",
    cell: ({ row }) => <div>{row.getValue("projectTitle")}</div>,
  },
  {
    accessorKey: "people",
    header: "구성원 수",
    cell: ({ row }) => <div>{(row.getValue("people") as string[]).length}</div>,
  },
  {
    accessorKey: "progressRatio",
    header: "진행률",
    cell: ({ row }) => <div>{row.getValue("progressRatio")}</div>,
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "startAt",
    header: "시작일",
    cell: ({ row }:{ row: Row<Project> }) => (
      <div className="capitalize">{(row.getValue("startAt") as string).split('T')[0]}</div>
    ),
  },
  {
    accessorKey: "endAt",
    header: "종료일",
    cell: ({ row }:{ row: Row<Project> }) => (
      <div className="capitalize">{(row.getValue("endAt") as string).split('T')[0]}</div>
    ),
  },

  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }:{ row: Row<Project> }) => {

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>부가기능</DropdownMenuLabel>
  //             <DropdownMenuItem>프로젝트 현황 확인</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
// ProjectList: 특정 사용자의 프로젝트를 개괄적으로 보는 컴포넌트
const ProjectList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // useState를 통한 상태변화 관리 들어가기
  // 프로젝트의 목록
  const [projects, setProjects] = useState<Project[]>([])
  // 정렬 상태
  const [sorting, setSorting] = useState<SortingState>([])
  // 필터링 상태
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [])
  // 열 표시 상태
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  // 행 선택 상태
  const [rowSelection, setRowSelection] = useState({})
  // 테이블 상태
  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  // useEffect를 활용한 사용자의 프로젝트 목록 보기.
  useEffect(() => {
    // 사용자의 프로젝트 목록 불러오기.
    const fetchProjects = async()=>{
      // 사용자의 프로젝트 목록 불러오기.
      const response = await getProject();
      // 프로젝트 데이터 정의
      console.log("1",response.data)
      const projectData = response.data.map((pjt: Project) => ({
        projectId: pjt.projectId, //프로젝트 pk
        prdId: pjt.prdId, // 프로젝트 코드
        startAt: pjt.startAt, //프로젝트 시작일
        endAt: pjt.endAt, //프로젝트 종료일
        projectTitle: pjt.projectTitle, //프로젝트 이름
        people: pjt.people, //프로젝트 구성원 수
        progressRatio: pjt.progressRatio, //프로젝트 진행률
        status: pjt.status, //프로젝트 상태
      }))
      setProjects(projectData);
      // 프로젝트 목록 상태 변경
      console.log("2",projectData)
    };
    fetchProjects();
  }, [])
  // 사용자의 프로젝트 목록에 새로운 프로젝트 추가하기. // 프로젝트 생성 모달 true. 
  const handleAddProject = () => {
    // 프로젝트 생성 모달 true.
    setIsModalOpen(true);
  };
  // 프로젝트 생성 모달 닫기.
  const handleCloseModal = () => {
    // 프로젝트 생성 모달 false.
    setIsModalOpen(false);
  };

  // 특정 프로젝트 행 클릭시, 특정 프로젝트에 진입할 수 있도록 하는 함수.
  const handleRowClick = (row: Row<Project>) => {
    const { prdId, projectId, projectTitle } = row.original;
    console.log("Clicked project ID:", prdId);
    if (prdId && projectTitle) {
      navigate(`/project/${prdId}`, { state: { prdId, projectId, projectTitle } });
    } else {
      console.error("Missing prdId or projectTitle in the data");
    }
  };

  return (
    
    <div className="w-full px-2 ">
      {/* 프로젝트 생성 모달 */}
      <ProjectAddModal isOpen={isModalOpen} onClose={handleCloseModal} />
      {/* 프로젝트 추가 버튼 */}
      <Button onClick={handleAddProject}>프로젝트 추가</Button>
      <div className="flex items-center py-2">
        {/* 프로젝트 이름 검색 입력창 */}
        <Input
          placeholder="프로젝트 이름을 입력해주요."
          value={(table.getColumn("projectTitle")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("projectTitle")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Project>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<Project, unknown>) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* 테이블 몸체 */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<Project> ) => (
                // 테이블 행
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell: Cell<Project, unknown>) => (
                    // 테이블 셀
                    <TableCell 
                      key={cell.id}
                      >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                // 테이블 행 끝
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-14 text-center"
                >
                  프로젝트가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-1">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>

  )
}

export default ProjectList;