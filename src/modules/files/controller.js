require('dotenv').config()
const fbAdmin = require('firebase-admin')
const filesModel = require('./model')
const path = require('path')
const multer = require('multer')
const format = require('util').format

const serviceAccount = require('../../../config/service_account_key.json')
fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
  storageBucket: process.env.firebase_storageBucket
})
const bucket = fbAdmin.storage().bucket()

module.exports = {
  multerImageConfig: () => {
    const uploadImg = multer({
      fileFilter: (req, file, cb) => {
        checkFileImgType(file, cb)
      },
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100000
      }
    })
    return uploadImg
  },

  multerDocumentConfig: () => {
    const uploadDoc = multer({
      fileFilter: (req, file, cb) => {
        checkFileDocType(file, cb)
      },
      storage: multer.memoryStorage(),
      limit: {
        fileSize: 10000000
      }
    })
    return uploadDoc
  },

  imageUpload: async (req, res) => {
    const { file } = req
    const projectId = req.body.project_id
    const type = req.body.type
    if (type !== undefined && type === 'cover') {
      file.originalname = type
    }
    try {
      const link = await uploadFileToStorage(file, 'image', projectId)
      res.status(200).send({
        status: 'success',
        url: link
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: 'Unable to upload'
      })
    }
  },

  documentUpload: async (req, res) => {
    const { file } = req
    const projectId = req.body.project_id
    try {
      const link = await uploadFileToStorage(file, 'document', projectId)
      res.status(200).send({
        status: 'success',
        url: link
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: 'Unable to upload'
      })
    }
  },

  getVideo: async (projectId) => { await filesModel.getVideo(projectId) },

  updateVideo: async (video, projectId) => { await filesModel.updateVideo(video, projectId) }

}

function checkFileImgType (file, cb) {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(new Error('Please provide only Images(.jpeg|.jpg|.png|.gif)'))
  }
}

function checkFileDocType (file, cb) {
  const filetypes = /pdf|doc/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(new Error('Please provide only Documents(.pdf or .docx)'))
  }
}

const uploadFileToStorage = (file, fileType, projectId) => {
  let prom = new Promise((resolve, reject) => {
    let newFileName = `${Date.now()}_${file.originalname}`
    let fileUpload
    if (fileType === 'image') {
      fileUpload = bucket.file(`Images/${projectId}/${newFileName}`)
    }
    if (fileType === 'document') {
      fileUpload = bucket.file(`Documents/${projectId}/${newFileName}`)
    }

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    blobStream.on('error', () => {
      reject(new Error('Something is wrong! Unable to upload at the moment.'))
    })

    blobStream.on('finish', () => {
      fileUpload.makePublic()
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`)
      resolve(url)
    })

    blobStream.end(file.buffer)
  })
  return prom
}
