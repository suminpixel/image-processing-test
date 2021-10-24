import * as React from 'react';
import styled from 'styled-components'
import axios from "axios";
import {SERVER_DOMAIN} from "../utils/constants";

const config = {
    header : {
        'Content-Type' : 'multipart/form-data'
    }
}

const BottomFunctions = ({fileInfo, setFileInfo}) => {

    const onClickSendImage = () => {
        axios.post(`${SERVER_DOMAIN}/api/detect`, fileInfo.file, config).then(res => {
            console.log('response', res)
        }).catch(error => {
            console.log('error', error)
        })
    }

    return (
        <BottomFunctionsWrapper>
            <button className={'button'}  onClick={onClickSendImage} disabled={fileInfo === null}>▶️ SEND IMAGE</button>
        </BottomFunctionsWrapper>
    );
};

const BottomFunctionsWrapper = styled.div`
  margin: 12px 0;
`;

export default BottomFunctions;