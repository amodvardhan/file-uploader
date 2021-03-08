import React, { useEffect } from "react";
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

  /**  remove icon which will be used to show on each preview */
  removeIcon: string;

  /** Once all the files are upload it update the caller with Array<ArrayBuffer> */
  onUploadFinish: (files: FileList) => void;

  /** Triggers when file is removed */
  onFileDelete: (file: File) => void;
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
    onUploadFinish,
  } = props;
  // global variables
  let dropArea: any;
  let progressBar: any;
  let uploadProgress: number[] = [];
  let totalFiles: number = 0;

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

  const handleFiles = (files: FileList) => {
    totalFiles = files.length;

    // if enable progress is set to true then only proceed
    enableProgress && initializeProgress(files.length);

    for (let index = 0; index <= totalFiles; ++index) {
      enableProgress && updateProgress(index);
      enablePreview && previewFile(files[index]);
    }

    // finish the file upload and update parent component
    onUploadFinish(files);
  };

  // triggers whenever user upload the files through upload button
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files as FileList);
  };

  // show the uploaded files as a preview
  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      // const wrapper = document.createElement("div");
      // const close = document.createElement("span");

      // close.classList.add(removeIcon);
      // wrapper.classList.add("preview_wraper");

      const element = document.createElement("embed");
      element.src = reader.result as string;

      // close.innerHTML = "X";
      // close.click = () => onFileDelete(file);
      // wrapper.appendChild(close);
      // wrapper.appendChild(element);
      document.getElementById("gallery")?.appendChild(element);
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
  const updateProgress = (fileNumber: any) => {
    const xhr = new XMLHttpRequest();
    let percent: number = 0;
    xhr.upload.addEventListener("progress", (e) => {
      (percent = fileNumber), (e.loaded * 100.0) / e.total || 100;
    });

    uploadProgress[fileNumber] = percent;
    let total =
      uploadProgress.reduce((tot, curr) => tot + curr, 0) /
      uploadProgress.length;
    progressBar.value = total;
  };

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
