import * as React from "react";
import styled from "styled-components";
import { useEffect } from "react";

const ResultTable = ({ result }) => {
  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <ResultTableWrapper>
      <tbody>
        <tr>
          <th></th>
          <th>Only image server processing</th>
          <th>Client-side pre-processing </th>
          <th>Speed efficiency</th>
        </tr>
        <tr>
          <td>Face Detect</td>
          {result.map((data, index) => {
            return (
              <td key={index}>
                {JSON.stringify(data)} <br /> <span>ms</span>
              </td>
            );
          })}
          {result.length >= 2 && (
            <td>
              {((result[0].detect_time - result[1].detect_time) /
                result[0].detect_time) *
                100}
              <br />
              <span>%</span>
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

  td::first-line {
    font-weight: bold;
    line-height: 1.6;
    color: #1c1d1f;
  }

  tr:nth-child(even) {
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
  }

  td {
    width: 25%;
    span:last-child {
      float: right;
    }
  }
`;

export default ResultTable;
