import * as React from 'react';
import styled from 'styled-components'


const CanvasBox = ({fileInfo, setFileInfo}) => {
    return (
        <CanvasBoxWrapper>
            <Canvas id={'canvas-origin'}/>
            <Canvas id={'canvas-output'}/>
            <Canvas id={'canvas-output-crop'}/>
        </CanvasBoxWrapper>
    );
};

const CanvasBoxWrapper = styled.div``;

const Canvas = styled.canvas`
  display: inline-block;
  border: 1px solid #ddd;
  margin: 0;
  padding: 0;
`;

export default CanvasBox;