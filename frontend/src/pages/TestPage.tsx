const TestPage = () => {
  const testArray = Array.from({ length: 50 }, (_, index) => (
    <p key={index}>TEST{index}</p>
  ));

  return <>{testArray}</>;
};

export default TestPage;
