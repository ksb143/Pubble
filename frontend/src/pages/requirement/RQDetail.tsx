import { useParams } from 'react-router-dom';

const RQDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 id 매개변수 추출

  return (
    <div>
      <h1>Requirement Detail</h1>
      <p>Showing details for requirement ID: {id}</p>
    </div>
  );
};

export default RQDetail;
