const TestPage = () => {
  const testArray = Array.from({ length: 50 }, (_, index) => (
    <div key={index}>TEST</div>
  ));

  return <>{testArray}</>;
};

export default TestPage;
