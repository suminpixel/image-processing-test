import * as React from 'react';
import styled from "styled-components";
import {useEffect} from "react";

const ResultTable = ({result}) => {

    useEffect(()=>{
        console.log(result)
    },[result])

    return (
        <ResultTableWrapper>
            <tr>
                <th></th>
                <th>Client PreProcessing</th>
                <th>Image server</th>
            </tr>
            <tr>
                <td>Function onload <br/> 혹은 모듈 로드타임 </td>
                {
                    result.map(data => {
                        return <td>{JSON.stringify(data)}</td>
                    })
                }
            </tr>
    </ResultTableWrapper>
    );
};

const ResultTableWrapper = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: 18px 0 22px 0;
  td, th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  td::first-line{
    font-weight: bold;
    line-height: 1.6;
    color: #1c1d1f;
  }

  tr:nth-child(even){
    background-color: #f2f2f2;
  }

  tr:hover {background-color: #ddd;}

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #04AA6D;
    color: white;
  }

  td {
    width: 25%;
  }

`;

export default ResultTable;