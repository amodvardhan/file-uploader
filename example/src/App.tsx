import React from 'react'

import FileUploader from '@amodv/react-file-uploader'
import '@amodv/react-file-uploader/dist/index.css'

const App = () => {
  return (
    <>
      <FileUploader
        information="Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region"
        fileType="image/*"
        buttonLabel="Select some files"
        multiple
        enablePreview
        enableProgress
        IconComponent={() => <strong>Icon Placeholer</strong>}
        onFileUpload={ (filesInArray: Array<ArrayBuffer>) => {
          return console.log(filesInArray)
        }}
      />
    </>
  )
}

export default App
