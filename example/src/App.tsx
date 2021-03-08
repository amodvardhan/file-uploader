import React from "react";

import FileUploader from "@amodv/react-file-uploader";
import "@amodv/react-file-uploader/dist/index.css";

const App = () => {
  return (
    <>
      <FileUploader
        key={Math.random()}
        information="Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region"
        fileType="image/*"
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
      />
    </>
  );
};

export default App;
