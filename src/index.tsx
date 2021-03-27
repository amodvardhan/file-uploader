import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface IFileUploaerProps {
  id: string;
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
  existingFiles: Array<File>;

  /** Once all the files are uploaded it update the caller with Array<ArrayBuffer> */
  onUploadFinish: (files: Array<File>) => void;

  /** Triggers when user clicks on delete,  return file which is to be deleted */
  onFileDelete: (file: File) => void;
}

/** File uploader with drag and drop events */
function FileUploader(props: IFileUploaerProps) {
  const {
    id,
    information,
    fileType,
    multiple,
    buttonLabel,
    IconComponent,
    enablePreview,
    enableProgress,
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
  // const [filesByteArray, setFilesByteArray] = useState<Array<ArrayBuffer>>([]);
  const [files, setFiles] = useState<Array<File>>([]);

  useEffect(() => {
    dropArea = document.getElementById(id);
    progressBar = document.getElementById("progress-bar");

    setFiles(existingFiles);

    // wiring events
    wireEvents();
    highglightArea(true);
    unhighlightArea(true);
    dropArea?.addEventListener("drop", handleDrop, false);

    return () => {
      // unwiring events
      unwireEvents();
      highglightArea(false);
      unhighlightArea(false);
      dropArea?.removeEventListener("drop", handleDrop, false);
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

    handleFiles(Array.from(files));
  };

  const handleFiles = (uploadedFiles: Array<File>) => {
    totalFiles = uploadedFiles.length;
    const newFiles: Array<File> = [...files, ...uploadedFiles];

    if (totalFiles === 0) return;

    // if enable progress is set to true then only proceed
    if (enableProgress) {
      initializeProgress(files.length);
      newFiles.forEach(updateProgress);
    }

    // finish the file upload and update parent component
    setValidFiles(newFiles);
  };

  const setValidFiles = (files: Array<File>) => {
    let validFiles: Array<File> = [];
    for (const file of files) {
      debugger;
      if (fileType.includes("image") && file.type.includes("image")) {
        validFiles = [...validFiles, file];
      } else if (file.type && fileType.includes(file.type)) {
        validFiles = [...validFiles, file];
      }
    }
    if (validFiles.length > 0) {
      setFiles(validFiles);
      onUploadFinish(validFiles);
    }
  };
  // triggers whenever user upload the files through upload button
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files ? e.target.files : []));
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

  // triggers when user click on delete icon
  const onDelete = (deletedFile: File) => {
    const updatedFiles = files.filter((file: File) => file !== deletedFile);

    setFiles(updatedFiles);
    onFileDelete(deletedFile);
  };

  return (
    <div id={id} className={styles.droparea}>
      <div className={styles.myform}>
        <div>{information}</div>
        <div style={{ textAlign: "center" }}>
          {IconComponent && <IconComponent />}
        </div>
        <div>
          <input
            type="file"
            id={`${id}_fileElem`}
            className={styles.fileElem}
            multiple={multiple}
            accept={fileType}
            onChange={onFileChange}
          />
          <label className={styles.button} htmlFor={`${id}_fileElem`}>
            {buttonLabel}
          </label>
        </div>
      </div>

      {enableProgress && (
        <progress id="progress-bar" max="100" value="0"></progress>
      )}
      {enablePreview && files.length > 0 && (
        <Preview files={files} onDelete={onDelete} />
      )}
    </div>
  );
}

interface IPreview {
  files: Array<File>;
  onDelete: (file: File) => void;
}

/** Shows the preview of the uploaded files */
function Preview(props: IPreview) {
  const { files, onDelete } = props;
  return (
    <ul className={styles.previewList}>
      {files.map((file: File, index: number) => (
        <li key={file.name + index}>
          <RenderFile type={file.type} file={file} />
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.close} onClick={() => onDelete(file)}></span>
        </li>
      ))}
    </ul>
  );
}

interface IRenderFile {
  file: File;
  type: string;
}

function RenderFile(props: IRenderFile) {
  const { file, type } = props;
  if (type === "application/pdf") {
    return (
      <embed
        className={styles.imagePreview}
        src={URL.createObjectURL(file)}
      ></embed>
    );
  } else if (type?.indexOf("image") > -1) {
    return (
      <img className={styles.imagePreview} src={URL.createObjectURL(file)} />
    );
  } else if (
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "application/vnd.ms-excel"
  ) {
    return (
      <img
        src="https://www.logo.wine/a/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.svg"
        className={styles.imagePreview}
      />
    );
  }

  return <span className={styles.otherFile}>{file.type}</span>;
}
export default FileUploader;
