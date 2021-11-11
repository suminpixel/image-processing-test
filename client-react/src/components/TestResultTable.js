import * as React from "react";
import styled from "styled-components";
import { useEffect } from "react";

const TestResultTable = ({ serverTime, clientTime, preTime, jsTime  }) => {

  return (
    <ResultTableWrapper>
      <h4>Result : </h4>
      <tbody>
        <tr>
          <th></th>
          <th>Non-preprocessing case</th>
          <th>Preprocessing case</th>
          <th>Only Client case (wasm)</th>
          <th>Only Client case (js)</th>
        </tr>
        <tr>
          <td>Face Detection</td>
          <td>{serverTime}</td>
          <td>{clientTime}</td>
          <td>{clientTime}</td>
          <td>{preTime}</td>
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
    width: 15%;
    span:last-child {
      float: right;
    }
  }
`;

export default TestResultTable;
