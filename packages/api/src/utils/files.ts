import fs from 'fs'
import http from 'http'

// Function to save a file from a FileStream object (Simulation)
export const saveFile = (file: ArrayBuffer, destinationPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(file)

    // Write buffer to the destination path
    fs.writeFile(destinationPath, buffer, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Simulate a file upload to S3 / Cloud Storage or any other service via api request
export const uploadFile = async (file: ArrayBuffer): Promise<{ files: { path: string } }> => {
  const options = {
    method: 'POST',
    hostname: 'postman-echo.com',
    path: '/post',
    headers: {},
    maxRedirects: 20,
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, function (res) {
      const chunks: any[] = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        resolve(JSON.parse(Buffer.concat(chunks).toString()))
      })

      res.on('error', function (error) {
        reject(error)
      })
    })

    const postData =
      '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="csvFile"; filename="path"\r\nContent-Type: "multipart/form-data"\r\n\r\n' +
      file +
      '\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--'

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')

    req.write(postData)

    req.end()
  })
}

// Example usage
// const exampleFileStream = fs.createReadStream('path/to/source/file');
// const destinationPath = 'path/to/destination/file';

// saveFileFromStream(exampleFileStream, destinationPath)
//   .then(() => {
//     console.log('File has been saved.');
//   })
//   .catch((error) => {
//     console.error('Failed to save the file:', error);
//   });
