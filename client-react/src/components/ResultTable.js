import * as React from "react";
import styled from "styled-components";
import { useEffect } from "react";

const ResultTable = ({ title, result, onlyClientTime, apiTime }) => {
  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <ResultTableWrapper>
      <h4>Result : </h4>
      <tbody>
        <tr>
          <th></th>
          <th>Non-preprocessing case</th>
          <th>Preprocessing case</th>
          <th>Only Client processing case</th>
        </tr>
        <tr>
          {result.length > 0 && <td>Face Detection</td>}
          {result.map((data, index) => {
            return (
              <td key={index}>
                {JSON.stringify(data)} <br /> {apiTime[index]} <span>ms</span>
              </td>
            );
          })}
          {result.length >= 2 && (
            <td>
              {onlyClientTime}
              <br /> <span>ms</span>
            </td>
          )}
        </tr>
      </tbody>
    </ResultTableWrapper>
  );
};

const ResultTableWrapper = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: 18px 0 22px 0;
  td,
  th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  td:first-child {
    font-weight: bold;
    line-height: 1.6;
    color: #1c1d1f;
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #04aa6d;
    color: white;
    word-break: break-all;
  }

  td {
    width: 25%;
    span:last-child {
      float: right;
    }
  }
`;

export default ResultTable;
