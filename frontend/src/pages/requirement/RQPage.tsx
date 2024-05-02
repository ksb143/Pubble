import { useMemo } from "react";
import RQTable from "./RQTable";
import { Button } from "@/shadcn/components/ui/button"

const RQPage = () => {
const columns = useMemo(
()=> [
  {
    accessorKey: "approvalStatus",
    header: "승인여부",
  },
  {
    accessorKey: "requirementId",
    header: "항목ID",
  },
  {
    accessorKey: "requirementName",
    header: "항목명",
  },
  {
    accessorKey: "description",
    header: "상세설명",
  },
  {
    accessorKey: "assignee",
    header: "담당자",
  },
  {
    accessorKey: "author",
    header: "작성자",
  },
  {
    accessorKey: "currentVersion",
    header: "현재버전",
  },
],[]
);

  const data = useMemo(
    ()=>
    Array(10)
    .fill({})
    .map((_, idx)=>({
      approvalStatus: "Y",
      requirementId: `OLD-00${idx+1}`,
      requirementName: "로그인",
      description: "사용자는 서비스를 사용 하기 위해 로그인한다.",
      assignee: "최지원",
      author: "최지원",
      currentVersion: `v1.${idx+1}`,
    })),
    []
  )
  return (
    <>
      <div>
        <p className='text-4xl'>올리브올드 쇼핑몰 제작 프로젝트</p>
        <p className='text-2xl'>2024.04.25. ~ 2024.05.25.</p>
        <br />
        <br />
        <RQTable columns={columns} data={data}/>
        {/* <Button variant="outline">Button</Button> */}
      </div>
    </>
  );
};

export default RQPage;
