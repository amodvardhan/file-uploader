import React, { useEffect, useState } from "react";
import "./styles.module.css";

interface IFileUploaerProps {
  /** Drag and Drop information label text  */
  information: string;
  /** Allow files types allowed to be uploaded  default is 'images/*' */
  fileType: string;
  /** Allow multiple files  default is true */
  multiple: boolean;
  /** Set Button label/text default is Select Files  */
  buttonLabel: string;
  /** Component which holds an icon Ex. <span className="drag-drop-icon"></span> */
  IconComponent?: any;

  /** If enabled uploaded files show preview, only for image */
  enablePreview?: boolean;
  /** If enabled uploaded files show progress */
  enableProgress?: boolean;

  /** Once all the files are upload it update the caller with Array<ArrayBuffer> */
  onFileUpload: (filesInByteArray: Array<ArrayBuffer>) => void;
}
/** File uploader with drag and drop events */
function FileUploader(props: IFileUploaerProps) {
  const {
    information,
    fileType,
    multiple,
    buttonLabel,
    IconComponent,
    enablePreview,
    enableProgress,
    onFileUpload,
  } = props;
  // global variables
  let dropArea: any;
  let progressBar: any;
  let uploadProgress: number[] = [];
  let totalFiles: number = 0;

  const [[], setFileArray] = useState<Array<ArrayBuffer>>([]);

  useEffect(() => {
    console.log("here");
    dropArea = document.getElementById("drop-area");
    progressBar = document.getElementById("progress-bar");

    // wiring events
    wireEvents();
    highglightArea(true);
    unhighlightArea(true);
    dropArea.addEventListener("drop", handleDrop, false);

    return () => {
      // unwiring events
      unwireEvents();
      highglightArea(false);
      unhighlightArea(false);
      dropArea.removeEventListener("drop", handleDrop, false);
    };
  }, [dropArea, progressBar]);

  // bind the events
  const wireEvents = () =>
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea?.addEventListener(eventName, preventDefaults, false);
    });

  // unbind the events attached
  const unwireEvents = () =>
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea?.removeEventListener(eventName, preventDefaults, false);
    });

  // prevent defaults the events
  const preventDefaults = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // triggers when dragenter and dragover event is fired
  const highglightArea = (wireEvent: boolean) => {
    ["dragenter", "dragover"].forEach((eventName) => {
      wireEvent
        ? dropArea?.addEventListener(eventName, highlight, false)
        : dropArea?.removeEventListener(eventName, highlight, false);
    });
  };

  // triggers when dragleave and drop are triggered
  const unhighlightArea = (wireEvent: boolean) => {
    ["dragleave", "drop"].forEach((eventName) => {
      wireEvent
        ? dropArea?.addEventListener(eventName, unhighlight, false)
        : dropArea?.removeEventListener(eventName, unhighlight, false);
    });
  };

  // add 'highlight' class once drag is performed
  const highlight = () => {
    dropArea?.classList.add("highlight");
  };

  // remove 'highlight' class once drop is performed
  const unhighlight = () => {
    dropArea?.classList.remove("highlight");
  };

  // triggers when files are being dropped
  const handleDrop = (e: any) => {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
  };

  const handleFiles = (files: any) => {
    files = [...files];
    totalFiles = files.length;

    initializeProgress(files.length);
    let counter = 0;
    for (let index = 0; index < totalFiles; index++) {
      uploadFile(files[index], ++counter);
    }
    Array.from(files).forEach(previewFile);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files;
    totalFiles = files ? files.length : 0;
    let counter = 0;
    for (let index = 0; index < totalFiles; index++) {
      uploadFile(files[index], ++counter);
    }
    Array.from(files).forEach(previewFile);
  };

  // trigges when files are being uploaded
  const uploadFile = (file: File, index: number) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      updateProgress(index, (e.loaded * 100.0) / e.total || 100);
    });

    convertToByteArray(file).then((arr: ArrayBuffer) => {
      let array: Array<ArrayBuffer> = [];

      setFileArray((prevState) => {
        array = [...prevState, arr];
        return array;
      });

      if (index === totalFiles) {
        onFileUpload(array);
      }
    });
  };

  // show the uploaded files as a preview
  const previewFile = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const img = document.createElement("img");
      img.src = reader.result as string;
      document.getElementById("gallery")?.appendChild(img);
    };
  };

  // inititalize the progress bar
  function initializeProgress(numFiles: any) {
    progressBar.value = 0;
    uploadProgress = [];

    for (let i = numFiles; i > 0; i--) {
      uploadProgress.push(0);
    }
  }

  // update the progress bar status
  const updateProgress = (fileNumber: any, percent: any) => {
    uploadProgress[fileNumber] = percent;
    let total =
      uploadProgress.reduce((tot, curr) => tot + curr, 0) /
      uploadProgress.length;
    progressBar.value = total;
  };

  // A promise object which reads the file and converts it to the byte[]
  const convertToByteArray = (file: File) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      // make sure the file is in READY state, so that we can process the image file
      fileReader.onload = function () {
        const buffer = new Uint8Array(fileReader.result as ArrayBuffer);
        let byteArray: any = [];
        for (var i = 0; i < buffer.length; i++) {
          byteArray.push(buffer[i]);
        }
        if (byteArray) {
          resolve(byteArray);
        } else {
          reject([]);
        }
      };
    });

  return (
    <div id="drop-area">
      <div className="my-form">
        <div>{information}</div>
        <div style={{ textAlign: "center" }}>
          {IconComponent && <IconComponent />}
        </div>
        <div>
          <input
            type="file"
            id="fileElem"
            multiple={multiple}
            accept={fileType}
            onChange={onFileChange}
          />
          <label className="button" htmlFor="fileElem">
            {buttonLabel}
          </label>
        </div>
      </div>

      {enableProgress && (
        <progress id="progress-bar" max="100" value="0"></progress>
      )}
      {enablePreview && <div id="gallery"></div>}
    </div>
  );
}

export default FileUploader;
