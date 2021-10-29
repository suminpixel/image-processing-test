import * as React from 'react';
import {useEffect, useState} from "react";
import Uploader from "./Uploader";
import BottomFunctions from "./BottomFunctions";
import styled from 'styled-components'
import CanvasBox from "./CanvasBox";
import ResultTable from "./ResultTable";

const TestContainer = () => {
    const [fileInfo, setFileInfo] = useState(null); // { file, url, width, height }

    const [result, setResult] = useState([]); // { detect_time, function_time }[]

    useEffect(()=>{

    },[])
    return (
        <TestContainerWrapper>
            <h2>TEST</h2>
            <Uploader fileInfo={fileInfo} setFileInfo={setFileInfo} />
            <BottomFunctions fileInfo={fileInfo} setFileInfo={setFileInfo} setResult={setResult} result={result}/>
            { result.length > 0 &&  <ResultTable result={result} />}
            <CanvasBox fileInfo={fileInfo} setFileInfo={setFileInfo} />
        </TestContainerWrapper>
    );
};

const TestContainerWrapper = styled.div`
  box-sizing: border-box;
  padding: 12px 28px;
`;

export default TestContainer;