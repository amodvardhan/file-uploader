export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// A promise object which reads the file and converts it to the byte[]
export const convertToByteArray = (file: File) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject([]);
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    // make sure the file is in READY state, so that we can process the image file
    fileReader.onload = function () {
      const buffer = new Uint8Array(fileReader.result as ArrayBuffer);
      let byteArray: any = [];
      for (var i = 0; i < buffer.length; i++) {
        byteArray.push(buffer[i]);
      }
      if (byteArray.length > 0) resolve(byteArray);
      else reject([]);
    };
  });
