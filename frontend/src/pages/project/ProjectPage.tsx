// 1. react 관련
import { useParams } from "react-router-dom";
// 2. library
// 3. api
// 4. store
// 5. components
import RequirementList from "@/components/requirement/RequirementList"

const ProjectPage =()=>{
  const { projectId } = useParams<{projectId: string}>();

  return(
    <div>
      <RequirementList projectId={projectId || 'defaultProjectId'}/>
    </div>  
    ) 

}

export default ProjectPage;