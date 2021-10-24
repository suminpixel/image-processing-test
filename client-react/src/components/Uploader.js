import * as React from 'react';
import styled from 'styled-components'
import {drawImageScaled, getImageInfoFromFile, initImageToCanvas} from "../utils/upload-manager";

const Uploader = ({fileInfo, setFileInfo}) => {


    const onChangeImage = (e) => {
        const targetFile = e.target.files[0];
        getImageInfoFromFile(targetFile, setFileInfo).then(
            res => {
                setFileInfo(res)
                console.log(res)
                drawImageScaled('canvas-origin', res.url);
            }
        );
    };

    return (
        <UploaderWrapper>
            {/*{ fileInfo !== null &&   <span>{fileInfo.file?.name}</span>}*/}
            {/*<label htmlFor='input-image'>*/}
            {/*    UPLOAD*/}
            {/*</label>*/}
            <input
                id='input-image'
                type='file'
                onChange={onChangeImage}
            />
        </UploaderWrapper>
    );
};

const UploaderWrapper = styled.form`
`;

export default Uploader;