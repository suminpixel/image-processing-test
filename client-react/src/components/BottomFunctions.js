import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { TEST_DOMAIN } from "../utils/constants";
import { useOpenCv } from "opencv-react";
//import faceModels from '../models/haarcascade_frontalface_default.xml'
//import {detectFace} from "../utils/image-processing-manager";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const BottomFunctions = ({
  fileInfo,
  result,
  setFileInfo,
  setResult,
  setOnlyClientTime,
  setApiTime,
    setServerTime,
                           setPreTime,
    setClientTime,
}) => {
  const { cv } = useOpenCv();
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const onBenchTest = async () => {
    if(!cv) return alert('need cv')
    await onServerTest().then(()=> onPreTest())

  }

  const onPreTest = async () => {
    const start = Date.now();
    // let gray2 = new cv.Mat();
    let src = cv.imread('canvas-origin');
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow('canvas-output', dst);
    src.delete(); dst.delete();


    const preProcessTime = Date.now() - start; //ms
    const outputCanvas = document.getElementById("canvas-output");
    outputCanvas.toBlob(async (blob) => {
      const target = new File([blob], "pre.jpg");
      const formData = new FormData();
      formData.append("file", target);
      formData.append("count", count);
      await axios
          .post(`${TEST_DOMAIN}/api/detect/face/pre`, formData, config)
          .then(async (res) => {
            console.log("response", res.data);
            const faces = res.data['Faces'];
            // await drawBox(res.data.Faces)
            console.log(faces)
            let targetFace;
            for(var i=0; i<6; i++){
              for(var j=0; j<6; j++){
                targetFace = ''
              }
            }
            const result = JSON.stringify({...res.data, totalTime: Date.now() - start ,preProcessTime: preProcessTime}, null, 1);
            setPreTime(result)
            clientDetect()
          })
          .catch((error) => {
            console.log("error", error);
          });
    });
  }

  const onServerTest = async () => {
    const start = Date.now();
    const selectedFile = document.getElementById('input-image').files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("count", count);
    await axios
        .post(`${TEST_DOMAIN}/api/detect/face`, formData, config)
        .then((res) => {
          console.log("response", res.data);
          const result = JSON.stringify({...res.data, totalTime: Date.now() - start}, null, 1);
          setServerTime(result)
        })
        .catch((error) => {
          console.log("error", error);
        });
  }

  const drawBox = (faces) => {
    const srcImg = document.getElementById("canvas-output");
    let src = new cv.imread(srcImg);

    let gray = new cv.Mat();

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
        cv.imshow("canvas-detected", dst);
      }

      roiGray.delete();
      roiSrc.delete();
    }

    cv.imshow("canvas-detected", src);
    src.delete();
    gray.delete();
  }

  const onTest = async (count) => {
    if (!cv) return;
    if (count > 1000) return;

    console.log(" ##### onTest : ", count);
    setIsLoading(true);
    const preStart = Date.now();
    await startPreProcessing(cv);
    const cropCanvas = document.getElementById("canvas-output-crop");
    const start = Date.now();
    cropCanvas.toBlob((blob) => {
      const preTarget = new File([blob], "pre.jpg");
      postImage(fileInfo.file, preTarget, count).then((res) => {
        setIsLoading(false);
        setApiTime([
          (Date.now() - start) / count,
          (Date.now() - preStart) / count,
        ]);
      });
    });
  };

  const postImage = async (target, preTarget, count) => {
    const formData = new FormData();
    formData.append("file", target);
    formData.append("pre_file", preTarget);
    formData.append("count", count);
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

  const clientDetect = async () => {
    console.log('clientDetect')
    const start = Date.now();
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

      // if (i === 0) {
      //   const rect = new cv.Rect(
      //       faces.get(i).x,
      //       faces.get(i).y,
      //       faces.get(i).width,
      //       faces.get(i).height
      //   );
      //   const dst = src.roi(rect);
      //   cv.imshow("canvas-output-crop", dst);
      // }

      roiGray.delete();
      roiSrc.delete();
    }
    const time = Date.now() - start; //ms
    console.log(time)
    setClientTime(time);

    console.log("faces[0]", faces[0]);
    cv.imshow("canvas-output", src);
    src.delete();
    gray.delete();
    faceCascade.delete();
    //eyeCascade.delete();
    faces.delete();
    eyes.delete();
  };


  const startPreProcessing = async (cv, beforeTime) => {
    const start = Date.now();
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
    const time = Date.now() - start; //ms
    setOnlyClientTime(time);

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
      <span>Iteration</span>
      <CountInput value={count} onChange={(e) => setCount(e.target.value)} />
      <button
        className={"button"}
        onClick={onBenchTest}
        disabled={fileInfo === null || isLoading}
      >
        ▶️ BENCH TEST
      </button>
    </BottomFunctionsWrapper>
  );
};

const BottomFunctionsWrapper = styled.div`
  margin: 12px 0;
`;

const CountInput = styled.input`
  margin: 0 8px;
  width: 80px;
`;

export default BottomFunctions;
