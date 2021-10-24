import * as React from 'react';
import styled from 'styled-components'
import axios from "axios";
import {SERVER_DOMAIN} from "../utils/constants";
import {useOpenCv} from "opencv-react";

const config = {
    headers : {
        "Content-Type" : 'multipart/form-data'
    }
}

const BottomFunctions = ({fileInfo, setFileInfo}) => {

    const { cv } = useOpenCv();

    const onClickSendImage = () => {

        // axios.get(`${SERVER_DOMAIN}/hello`,  config).then(res => {
        //     console.log('response', res)
        // }).catch(error => {
        //     console.log('error', error)
        // })
        const formData = new FormData();
        formData.append(
            "file", fileInfo.file
        );
        axios.post(`${SERVER_DOMAIN}/api/detect`, formData, config).then(res => {
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