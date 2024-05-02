import React from "react";

interface RQTableProps {
  columns: { accessorKey: string; header: string; }[];
  data: any[];
}

function RQTable({ columns, data }: RQTableProps) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.accessorKey}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(({ approvalStatus, requirementId, requirementName,description, assignee, author, currentVersion }) => (
          <tr key={approvalStatus + requirementId + requirementName + description + assignee + author + currentVersion}>
            <td>{approvalStatus}</td>
            <td>{requirementId}</td>
            <td>{requirementName}</td>
            <td>{description}</td>
            <td>{assignee}</td>
            <td>{author}</td>
            <td>{currentVersion}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RQTable;