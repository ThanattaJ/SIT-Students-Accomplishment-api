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

  uploadImage: async (req, res) => {
    const { file } = req
    const projectId = req.body.project_id
    const isCover = (req.body.isCover === 'true')
    if (isCover) {
      file.originalname = 'cover'
    }
    try {
      const link = await uploadFileToStorage(file, 'image', projectId, isCover)
      const image = {
        project_id: projectId,
        path_name: link
      }
      const coverExist = await checkCoverExist(projectId)
      if (!isCover || !coverExist) {
        await filesModel.createImage(image)
      }
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

  deleteImage: async (req, res) => {
    // eslint-disable-next-line camelcase
    const { path_name } = req.body
    const path = path_name.replace(`https://storage.googleapis.com/${bucket.name}/`, '')
    try {
      await bucket.file(path).delete()
      await filesModel.deleteImage(path)
      res.status(200).send({
        status: 'success',
        url: 'Delete Image Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: 'Delete Failure'
      })
    }
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

  uploadDocument: async (req, res) => {
    const { file } = req
    const projectId = req.body.project_id
    try {
      const link = await uploadFileToStorage(file, 'document', projectId, false)
      const doc = {
        project_id: projectId,
        path_name: link
      }
      await filesModel.createDocument(doc)
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

  deleteDocument: async (req, res) => {
    // eslint-disable-next-line camelcase
    const { path_name } = req.body
    const path = path_name.replace(`https://storage.googleapis.com/${bucket.name}/`, '')
    try {
      await bucket.file(path).delete()
      await filesModel.deleteDocument(path)
      res.status(200).send({
        status: 'success',
        url: 'Delete Document Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: 'Delete Failure'
      })
    }
  },

  getVideo: async (projectId) => { await filesModel.getVideo(projectId) },

  updateVideo: async (video, projectId) => { await filesModel.updateVideo(video, projectId) },

  getCover: async (req, res) => {
    const id = req.params.id
    const check = await checkCoverExist(id)
    res.send(check)
  }
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

async function checkCoverExist (projectId) {
  const cover = await filesModel.getCoverImage(projectId)
  if (cover.length > 0) {
    return true
  } else {
    return false
  }
}

function checkFileDocType (file, cb) {
  const filetypes = /pdf/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(new Error('Please provide only Documents(.pdf)'))
  }
}

const uploadFileToStorage = (file, fileType, projectId, isCover) => {
  let prom = new Promise((resolve, reject) => {
    let newFileName = file.originalname
    if (isCover === false) {
      newFileName = `${Date.now()}_${file.originalname}`
    }
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
