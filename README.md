# @amodv/react-file-uploader

> File uploader with drag and drop functionality using HTML 5 and ReactJs

[![NPM](https://img.shields.io/npm/v/@amodv/react-file-uploader.svg)](https://www.npmjs.com/package/@amodv/react-file-uploader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @amodv/react-file-uploader
```

## Usage

```tsx
import React, { Component } from "react";

import FileUploader from "@amodv/react-file-uploader";
import "@amodv/react-file-uploader/dist/index.css";

class ExampleComponent extends Component {
  render() {
    // pass all requied props
    return <FileUploader {...props} />;
  }
}
```

## Props

| props           | description                                                                                                                              | required |   default value   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | :---------------: |
| information     | add the information text within the box(droppable area)                                                                                  | true     |                   |
| fileType        | allowed files to be uploaded                                                                                                             | true     |     image/\*      |
| multiple        | allow multiple files to be uploaded                                                                                                      | true     |       true        |
| buttonLabel     | set your button label                                                                                                                    | true     | Select many files |
| IconComponent   | A react component which will be rendered within the droppable area. Example- any could image within span tag                             | false    |                   |
| enablePreview   | if enabled preview will be shown                                                                                                         | false    |                   |
| enableProgress  | if enabled it will show the progress bar. Note: Currently not supported                                                                  | false    |                   |
| removeIconClass | you can pass your own class name for close icon. Ex. font-awesome                                                                        | true     |                   |
| existingFiles   | Array<File> type which will be passed as a prop, if enablePreview is set to true then preview will be rendered from existingFiles array. | true     |                   |
| onUploadFinish  | A function which will update the parent component by passing Array<File>.                                                                | true     |                   |
| onFileDelete    | A function which updates parent which file is deleted from the preview                                                                   | true     |                   |

## License

MIT © [Amod Vardhan](https://github.com/AmodVardhan)
