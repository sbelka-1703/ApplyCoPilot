import React, { useEffect, useState } from 'react'
import axios from 'axios'
const UploadPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files.length) {
      setFile(event.dataTransfer.files[0])
    }
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`)
      .then((response) => {
        console.log(response.data.message) // Should log "Hello World"
      })
      .catch((error) => {
        console.error('Error fetching hello message:', error)
      })
  }, [])

  // const handleUpload = async () => {
  //   if (file) {
  //     const formData = new FormData()
  //     formData.append('file', file)

  //     try {
  //       const response = await fetch('/api/process-cv', {
  //         method: 'POST',
  //         body: formData
  //       })
  //       const data = await response.json()
  //       setExtractedText(data.text)
  //     } catch (error) {
  //       console.error('Error uploading and processing PDF:', error)
  //     }
  //   }
  // }

  return (
    // <form onSubmit={handleUpload}>
    <form>
      <input
        type='file'
        style={{ display: 'none' }}
        accept='application/pdf'
        onChange={handleFileChange}
        id='fileInput'
      />
      <button
        type='button'
        className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}>
        Upload PDF
      </button>
      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}
      {/* <button
          type='submit'
          className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800'>
          Submit
        </button> */}
      <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800'>
        Submit
      </button>
    </form>
  )
}

export default UploadPdf
