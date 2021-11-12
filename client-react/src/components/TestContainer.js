import * as React from "react";
import { useEffect, useState } from "react";
import Uploader from "./Uploader";
import BottomFunctions from "./BottomFunctions";
import styled from "styled-components";
import CanvasBox from "./CanvasBox";
import TestResultTable from "./TestResultTable";
import {TEST_DOMAIN} from "../utils/constants";

const TestContainer = () => {
  const [fileInfo, setFileInfo] = useState(null); // { file, url, width, height }

  const [result, setResult] = useState([]); // { detect_time, function_time }[]
  const [onlyClientTime, setOnlyClientTime] = useState(0); //ms
  const [apiTime, setApiTime] = useState([]); //ms[]
    const [preTime, setPreTime] = useState(); //ms[]
    const [serverTime, setServerTime] = useState();
    const [clientTime, setClientTime] = useState();

  return (
    <TestContainerWrapper>
      <h2>Face Detect Test</h2>
      <Uploader fileInfo={fileInfo} setFileInfo={setFileInfo} />
      <BottomFunctions
        fileInfo={fileInfo}
        setFileInfo={setFileInfo}
        setResult={setResult}
        result={result}
        setOnlyClientTime={setOnlyClientTime}
        setApiTime={setApiTime}
        setServerTime={setServerTime}
        setPreTime={setPreTime}
        setClientTime={setClientTime}
      />
        <TestResultTable serverTime={serverTime} preTime={preTime} clientTime={clientTime} />

      {/*<ResultTable*/}
      {/*  title={"Face Detect"}*/}
      {/*  result={result}*/}
      {/*  onlyClientTime={onlyClientTime}*/}
      {/*  apiTime={apiTime}*/}
      {/*/>*/}

      <CanvasBox fileInfo={fileInfo} setFileInfo={setFileInfo} />
    </TestContainerWrapper>
  );
};

const TestContainerWrapper = styled.div`
  box-sizing: border-box;
  padding: 12px 28px;
  display: relative;
`;

export default TestContainer;
