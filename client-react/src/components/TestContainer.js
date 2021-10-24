import * as React from 'react';
import {useState} from "react";
import Uploader from "./Uploader";
import BottomFunctions from "./BottomFunctions";
import styled from 'styled-components'
import CanvasBox from "./CanvasBox";

const TestContainer = () => {
    const [fileInfo, setFileInfo] = useState(null); // { file, url, width, height }

    return (
        <TestContainerWrapper>
            <h2>TEST</h2>
            <Uploader fileInfo={fileInfo} setFileInfo={setFileInfo} />
            <BottomFunctions fileInfo={fileInfo} setFileInfo={setFileInfo} />
            <CanvasBox fileInfo={fileInfo} setFileInfo={setFileInfo} />
        </TestContainerWrapper>
    );
};

const TestContainerWrapper = styled.div`
  box-sizing: border-box;
  padding: 12px 28px;
`;

export default TestContainer;