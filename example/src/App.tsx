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
        removeIconClass=""
        existingFiles={[]}
        IconComponent={() => <strong>Icon Placeholer</strong>}
        onUploadFinish={(filesInArray: FileList) => {
          return console.log(filesInArray);
        }}
        onFileDelete={(remainingFiles: Array<File>) =>
          console.log(remainingFiles, "file")
        }
      />
    </>
  );
};

export default App;
