"use client"

import { ImageDropzone } from '@/components/ui/image-dropzone'

const page = () => {

  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files)
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Images</h1>
      <ImageDropzone onUpload={handleUpload} />
    </div>
  )
}

export default page