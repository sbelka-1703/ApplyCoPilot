import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { convert } from 'pdf-img-convert'
import Tesseract from 'tesseract.js'

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log('Processing CV...')
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
    multiples: true
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable file parse error:', err)
      res.status(500).json({ error: 'Error parsing the form: ' + err })
      return
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file
      const pdfData = fs.readFileSync(file.filepath)
      const images = await convert(pdfData, {
        page_numbers: [0], // Convert the first page
        scale: 1.0,
        base64: true
      })

      const texts = await Promise.all(
        images.map((img) =>
          Tesseract.recognize(img, 'eng', { logger: (m) => console.log(m) }).then((result) => result.data.text)
        )
      )

      res.status(200).json({ text: texts.join(' ') })
    } catch (error) {
      console.error('Error in PDF conversion or OCR processing:', error)
      res.status(500).json({ error: 'Error processing the file: ' + error })
    }
  })
}
