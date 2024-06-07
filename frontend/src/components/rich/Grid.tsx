interface GridProps {
  rows: number;
  cols: number;
  onCellClick: (rowIndex: number, colIndex: number) => void;
}

const Grid = ({ rows, cols, onCellClick }: GridProps) => {
  // 각 셀을 구성하는 함수
  const renderCell = (rowIndex: number, colIndex: number) => {
    const isSelected = rowIndex < rows && colIndex < cols;
    return (
      <div
        className={`h-5 w-5 border border-gray-200 ${isSelected ? 'bg-blue-50' : ''}`}
        key={`${rowIndex}-${colIndex}`}
        onClick={() => onCellClick(rowIndex + 1, colIndex + 1)}
      />
    );
  };

  // 전체 그리드를 구성하는 함수
  const renderGrid = () => {
    const totalRows = 14; // 전체 행 수
    const totalCols = 14; // 전체 열 수
    const grid = [];

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < totalCols; colIndex++) {
        row.push(renderCell(rowIndex, colIndex));
      }
      grid.push(
        <div style={{ display: 'flex' }} key={rowIndex}>
          {row}
        </div>,
      );
    }
    return grid;
  };

  return <div>{renderGrid()}</div>;
};

export default Grid;
