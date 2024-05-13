// 1. react 관련
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
// 2. library 관련
import { getProject, addProject } from "@/apis/project";
// 3. component 관련
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProjectAddModal } from "@/components/main/ProjectAddModal"

export type Project = {
  projectId: string
  startAt: string
  endAt: string
  projectTitle: string
  people: number
  progressRatio: number
  status: "in progress" | "complete" | "before start"
}

export const columns: ColumnDef<Project>[] = [
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
    accessorKey: "projectTitle",
    header: "프로젝트 이름",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("projectTitle")}</div>
    ),
  },
  {
    accessorKey: "people",
    header: "구성원 수",
    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("people") as string[]).length}</div>
      ),
  },
  {
    accessorKey: "progressRatio",
    header: "진행률",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("progressRatio")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "startAt",
    header: "시작일",
    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("startAt") as string).split('T')[0]}</div>
    ),
  },
  {
    accessorKey: "endAt",
    header: "종료일",
    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("endAt") as string).split('T')[0]}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>부가기능</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.projectId)}
            >
              프로젝트 이름 복사
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>프로젝트 현황 확인</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const ProjectList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // useState를 통한 상태변화 관리
  const [projects, setProjects] = useState<Project[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

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
  // 사용자의 프로젝트 목록 불러오기.
  useEffect(() => {
    const fetchProjects = async()=>{
      const response = await getProject();
      const projectData = response.data.map((pjt: Project) => ({
        projectId: pjt.projectId,
        startAt: pjt.startAt,
        endAt: pjt.endAt,
        projectTitle: pjt.projectTitle,
        people: pjt.people,
        progressRatio: pjt.progressRatio,
        status: pjt.status,
      }))
      setProjects(projectData);
      console.log(projectData)
    };
    fetchProjects();
  }, [])
  // 사용자의 프로젝트 목록에 새로운 프로젝트 추가하기.
  const handleAddProject = () => {
    setIsModalOpen(true); // 프로젝트 생성 모달 열기.
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 프로젝트 생성 모달 닫기.
  };

  // 특정 프로젝트 행 클릭시, 특정 프로젝트에 진입할 수 있도록 하는 함수.
  const handleRowClick = (projectId: string)=>{
    navigate(`/project/${projectId}`);
  }

  return (
    
    <div className="w-full overflow-hidden px-2 max-h-[500px]">
      <br />
      
      <ProjectAddModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <Button onClick={handleAddProject}>프로젝트 추가</Button>
      <div className="flex items-center py-2">
        <Input
          placeholder="프로젝트 이름을 입력해주세요."
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={()=> handleRowClick(row.original.projectId)}
                >
                  {row.getVisibleCells().map((cell) => (
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
                
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
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