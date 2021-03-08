import React from "react";

import FileUploader from "@amodv/react-file-uploader";
import "@amodv/react-file-uploader/dist/index.css";

const App = () => {
  return (
    <>
      <FileUploader
        information="Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region"
        fileType="image/*"
        buttonLabel="Select some files"
        multiple
        enablePreview
        removeIcon="close"
        IconComponent={() => <strong>Icon Placeholer</strong>}
        onUploadFinish={(filesInArray: FileList) => {
          return console.log(filesInArray);
        }}
        onFileDelete={(file: File) => console.log(file, "file")}
      />
    </>
  );
};

export default App;
