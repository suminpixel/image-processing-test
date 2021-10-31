import { OpenCvProvider, useOpenCv } from "opencv-react";
import { useState } from "react";
import TestContainer from "./components/TestContainer";

function App() {
  const onLoaded = (cv) => {
    console.log("ImagesUploader => opencv loaded", cv);
  };

  return (
    <OpenCvProvider onLoad={onLoaded} openCvPath="opencv.js">
      <TestContainer />
    </OpenCvProvider>
  );
}

export default App;
