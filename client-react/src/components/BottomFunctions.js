import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { SERVER_DOMAIN, TEST_DOMAIN } from "../utils/constants";
import { useOpenCv } from "opencv-react";
//import faceModels from '../models/haarcascade_frontalface_default.xml'
//import {detectFace} from "../utils/image-processing-manager";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const BottomFunctions = ({ fileInfo, result, setFileInfo, setResult }) => {
  const { cv } = useOpenCv();
  const [preTime, setPretime] = useState({ pre_time: null });

  const onTest = async () => {
    if (!cv) return;
    await startPreProcessing(cv);
    const cropCanvas = document.getElementById("canvas-output-crop");
    cropCanvas.toBlob((blob) => {
      const preTarget = new File([blob], "pre.png");
      postImage(fileInfo.file, preTarget);
    });
  };

  const postImage = async (target, preTarget) => {
    const formData = new FormData();
    formData.append("file", target);
    formData.append("pre_file", preTarget);
    await axios
      .post(`${TEST_DOMAIN}/api/detect`, formData, config)
      .then((res) => {
        console.log("response", res.data);
        setResult([...res.data]);
      })
      .catch((error) => {
        console.log("error", error);
        Promise.resolve(null);
      });
  };

  const startPreProcessing = async (cv, beforeTime) => {
    // let gray2 = new cv.Mat();
    const srcImg = document.getElementById("canvas-origin");
    let src = new cv.imread(srcImg);

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    let faces = new cv.RectVector();
    let eyes = new cv.RectVector();
    let faceCascade = new cv.CascadeClassifier();
    // let eyeCascade = new cv.CascadeClassifier();
    faceCascade.load("haarcascade_frontalface_default.xml");
    // eyeCascade.load('haarcascade_eye.xml');

    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

    for (let i = 0; i < faces.size(); ++i) {
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      let point2 = new cv.Point(
        faces.get(i).x + faces.get(i).width,
        faces.get(i).y + faces.get(i).height
      );
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);

      if (i === 0) {
        const rect = new cv.Rect(
          faces.get(i).x,
          faces.get(i).y,
          faces.get(i).width,
          faces.get(i).height
        );
        const dst = src.roi(rect);
        cv.imshow("canvas-output-crop", dst);
      }

      roiGray.delete();
      roiSrc.delete();
    }

    console.log("faces[0]", faces[0]);
    cv.imshow("canvas-output", src);
    src.delete();
    gray.delete();
    faceCascade.delete();
    //eyeCascade.delete();
    faces.delete();
    eyes.delete();
  };

  return (
    <BottomFunctionsWrapper>
      {/* <button
        className={"button"}
        onClick={() => postImage(fileInfo.file)}
        disabled={fileInfo === null}
      >
        ▶️ SEND IMAGE TO SERVER
      </button>
      <button
        className={"button"}
        onClick={() => detectFace(cv)}
        disabled={fileInfo === null}
      >
        ▶️ PREPROCESSING IMAGE
      </button> */}
      <button
        className={"button"}
        onClick={onTest}
        disabled={fileInfo === null}
      >
        ▶️ BENCH TEST
      </button>
    </BottomFunctionsWrapper>
  );
};

const BottomFunctionsWrapper = styled.div`
  margin: 12px 0;
`;

export default BottomFunctions;
