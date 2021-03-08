import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { arrayBufferToBase64, convertToByteArray } from "./common";
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

  /**  remove icon class name, which will be used to show on each preview */
  removeIconClass: string;

  /** Already added files as array of byte[] */
  existingFiles: Array<ArrayBuffer>;

  /** Once all the files are upload it update the caller with Array<ArrayBuffer> */
  onUploadFinish: (files: FileList) => void;

  /** Triggers when file is removed */
  onFileDelete: (remainingFiles: Array<File>) => void;
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
    removeIconClass,
    existingFiles,
    onFileDelete,
    onUploadFinish,
  } = props;

  // global variables
  let dropArea: any;
  let progressBar: any;
  let uploadProgress: number[] = [];
  let totalFiles: number = 0;

  // states
  const [filesByteArray, setFilesByteArray] = useState<Array<ArrayBuffer>>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    dropArea = document.getElementById("drop-area");
    progressBar = document.getElementById("progress-bar");

    setFilesByteArray(existingFiles);

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
    const dt = e.dataTransfer;
    const files = dt.files;

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
    setFiles(Array.from(files));
  };

  // triggers whenever user upload the files through upload button
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files as FileList);
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

  // show the uploaded files as a preview
  const previewFile = (file: File) => {
    convertToByteArray(file).then((fileInBytes: ArrayBuffer) => {
      let updatedFiles: Array<ArrayBuffer> = [];
      setFilesByteArray((prevState: Array<ArrayBuffer>) => {
        updatedFiles = [...prevState, fileInBytes];
        return updatedFiles;
      });
    });
  };

  // triggers when user click on delete icon
  const onDelete = (index: number) => {
    const updatedFiles = filesByteArray.filter(
      (_, idx: number) => idx !== index
    );
    setFilesByteArray(updatedFiles);
    // delete the file from the file[]
    files.splice(index, 1);
    // update the parent component with remaining files
    onFileDelete(files);
  };

  return (
    <div id="drop-area" className={styles.droparea}>
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
      {enablePreview && filesByteArray.length > 0 && (
        <div id="gallery">
          {filesByteArray.map((file: ArrayBuffer, index: number) => (
            <div key={`previw_${index}`}>
              <span
                className={removeIconClass ? removeIconClass : "close"}
                onClick={() => onDelete(index)}
              ></span>
              <embed
                src={`data:image/png;base64,${arrayBufferToBase64(file)}`}
              ></embed>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUploader;
