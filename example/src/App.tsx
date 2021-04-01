import React from "react";

import FileUploader from "@amodv/react-file-uploader";
import "@amodv/react-file-uploader/dist/index.css";

const App = () => {
  return (
    <>
      <FileUploader
        id="1"
        information="Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region"
        fileType="application/pdf"
        buttonLabel="Select some files"
        multiple
        enablePreview
        removeIconClass=""
        existingFiles={[]}
        IconComponent={() => <strong>Icon Placeholer</strong>}
        onUploadFinish={(filesInArray: Array<File>) => {
          return console.log(filesInArray);
        }}
        onFileDelete={(deletedFie: File) => console.log(deletedFie, "file")}
        children={<h5>Preview</h5>}
      />

      <FileUploader
        id="2"
        information="Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region"
        fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        buttonLabel="Select some files"
        multiple
        enablePreview
        removeIconClass=""
        existingFiles={[]}
        IconComponent={() => <strong>Icon Placeholer</strong>}
        onUploadFinish={(filesInArray: Array<File>) => {
          return console.log(filesInArray);
        }}
        onFileDelete={(deletedFie: File) => console.log(deletedFie, "file")}
        children={<h2>Preview</h2>}
      />
    </>
  );
};

export default App;
