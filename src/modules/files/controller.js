require('dotenv').config()
const fbAdmin = require('firebase-admin')
const filesModel = require('./model')
const path = require('path')
const multer = require('multer')
const format = require('util').format
const { validate } = require('../validation')
const { deleteSchema, getCoverSchema, uploadImgSchema, uploadDocSchema } = require('./json_schema')

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert({
    'type': process.env.type,
    'project_id': process.env.project_id,
    'private_key_id': process.env.private_key_id,
    'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDILhMHRI1klWft\nkvltRrEoSGuLtLw+Vv7WJYDtMTp7NsUokOGQSZuPcO6t35q1/ZSr05Rb9l2rnF7Q\nmbcRjpzItTQv9VgW9xazxRRgsUDgVFTUclb/YBOrtFIoFVUCuPJIWlS5PIJQNoHC\nn3Y6R0O/wY+5VZ0VwUr7OHoczZTrsY7nkWgnZhtvmWMjE4+s1NeZb99vfdvT1OHi\nYY8W8F4aSgHZl+rUVGeasS+3qJa6AzWwHDM18vjJ3aYeStE0xTka+qlXrW4abxVP\n3/OsWz1oy8El6TNzrdPq9mCEQ1EaUOPOmERx+A1UglpfqAWSmosjQ3BGROmIJrzl\nJ23ClXfDAgMBAAECggEACzI0g0AMznbiyLFjPP7qsq+WQEqcCrqP50dStjF+LV0L\nWvD7hLfxOO0elGAAxbQIqDGdxyT46TvGO9GVISjCUSF9aT9GLYalYOmhcaUIVWOy\nGO3KOt9TSlO8Epza09unRW+z9GZTfYwG5u1HTgwlWGjJkpqcvhZBDNsETW8cKLB8\n1DVE9VFA20q6BiSFojbGvrQYK0UBYWtmrhS8rl29k1Y7G9SBr0jvHRiY4SpUW8tA\nifcmTLqPa/uCnOVs+1KdAKp9S4lNqJQFDLULHtQrnCyhwaHjgZpkAErPGV/ZdI4x\nL8smmXWbqETNqaKWQJjw0qhRzQ+rc6NGv3TjN+5E1QKBgQDkjxlpN0kPgwKfRyzV\nTrT1gfPwrg0bBe2VkiTfa/ATmao7VZPkkBP8YimX2PoRELgYhPPFLE+ZbCHJsHU6\nYb0vVuLXGVXQTrHj0nZaG8eMEUZGZrx0yhRAEH4ZX9jnRg01TvuvFC4p252TS3/A\nbyXU+TE44/srxSL5+0qHi4Ui9wKBgQDgNrqcqpuD8RZ7Kgyqveq8zGHJS7ZWr+Mr\nqg6/cdec8ZHPqRfJzKRDRR8CSc1j0KQITlglsQU+SzIp/kvoRpxST4esY2K+CRTV\nh3aIScX7ayExiRuxrDnjkD4ksrgWezUjTrwWxd8KxB1ReMenWyzRAtiH9AMYxvrL\nfNUigANSlQKBgG3PbtcFT93bBOR/rsOhOAIIeKo3BWbpVzeYaozJcCQKnSY6vH6A\n1olYpEEnZyXR0ZE+N1yRKIE+2ZDsbbYqBVn8NapAquEVHhSmJmSumhXqqsfiTkMS\nX95TzjHkwfKDzo7BLtz0JiXINRHyoSNUg2mqfAKoTiG+akqOeEVdPA8LAoGBALsh\nsnqTghyLGUJOhCf1Pne49Vx2TobnYejNlGWAdH5OuG3jKTGKFQb4J7tXMY8/UciE\n6tj6d+/X/tRBo8UHOe0Q56GfiYgmODdHSkzRleYTMa8QSgbuQZqGhvdGGpLY3i7L\nxfwTxeZMbFPVRH2PgUYo4+QEaplBaYxwccrLoPpJAoGAKlBSjehkengW47JN6zil\nnvKty7WmDvEUBW3YxHVMCJDpk1iMtgC8LaYPFE8ZT1zEoU+GoBTwSF47rso41bA/\nFYvPGMpWRzVHn2G2ji9QSQS1aS6jyDIs43rmtx/DfPs4aDkUav5NT1F11wHwwAeH\ni0m1Sugwi4hND/cJdgGPDEE=\n-----END PRIVATE KEY-----\n',
    'client_email': process.env.client_email,
    'client_id': process.env.client_id,
    'auth_uri': process.env.auth_uri,
    'token_uri': process.env.token_uri,
    'auth_provider_x509_cert_url': process.env.auth_provider_x509_cert_url,
    'client_x509_cert_url': process.env.client_x509_cert_url
  }),
  storageBucket: process.env.firebase_storageBucket
})
const bucket = fbAdmin.storage().bucket()

const uploadFileToStorage = function (file, fileType, id, isProfile) {
  let prom = new Promise((resolve, reject) => {
    let newFileName = file.originalname
    let fileUpload
    if (fileType === 'image') {
      newFileName = `${Date.now()}_${file.originalname}`
      if (isProfile === false) {
        fileUpload = bucket.file(`Images/${id}/${newFileName}`)
      } else if (isProfile === true) {
        fileUpload = bucket.file(`ProfileImage/${id}/${newFileName}`)
      }
    }

    if (fileType === 'document') {
      newFileName = `${Date.now()}_${file.originalname}`
      fileUpload = bucket.file(`Documents/${id}/${newFileName}`)
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

const deleteObjectStorage = async function (pathName, typeObject) {
  const path = pathName.replace(`https://storage.googleapis.com/${bucket.name}/`, '')
  await bucket.file(path).delete()
  if (typeObject === 'image') {
    await filesModel.deleteProjectImage(path)
  } else if (typeObject === 'document') {
    await filesModel.deleteProjectDocument(path)
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
  try {
    const cover = await filesModel.getCoverImage(projectId)
    if (cover.length > 0) {
      return cover[0].path_name
    } else { return undefined }
  } catch (err) {
    throw new Error(err)
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

module.exports = {
  multerImageConfig: () => {
    const uploadImg = multer({
      fileFilter: (req, file, cb) => {
        checkFileImgType(file, cb)
      },
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 35000000
      }
    })
    return uploadImg
  },

  uploadProjectImageMulti: async (req, res) => {
    try {
      const { files } = req
      const projectId = req.body.project_id
      const images = []
      const promise = files.map(async file => {
        const link = await uploadFileToStorage(file, 'image', projectId, false)
        const image = {
          project_id: projectId,
          path_name: link
        }
        images.push(image)
      })
      await Promise.all(promise)
      await filesModel.createProjectImage(images)

      res.status(200).send({
        status: 'success',
        url: images
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  uploadProjectImage: async (req, res) => {
    const { checkStatus, err } = validate(req.body, uploadImgSchema)
    if (!checkStatus) return res.send(err)

    const { file } = req
    if (file === undefined) {
      return res.status(500).send({
        status: 500,
        message: 'Dose Not Exsit File'
      })
    }
    const projectId = req.body.project_id
    const isCover = (req.body.isCover === 'true')
    if (isCover) {
      file.originalname = 'cover'
    }

    try {
      const link = await uploadFileToStorage(file, 'image', projectId, false)
      const image = {
        project_id: projectId,
        path_name: link
      }
      const coverExist = await checkCoverExist(projectId)
      if (isCover && coverExist !== undefined) {
        await deleteObjectStorage(coverExist, 'image')
      }
      await filesModel.createProjectImage(image)
      res.status(200).send({
        status: 'success',
        url: link
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  deleteProjectImage: async (req, res) => {
    const { checkStatus, err } = validate(req.body, deleteSchema)
    if (!checkStatus) return res.send(err)

    // eslint-disable-next-line camelcase
    const { path_name } = req.body
    try {
      await deleteObjectStorage(path_name, 'image')
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
        fileSize: 5000000
      }
    })
    return uploadDoc
  },

  uploadProjectDocument: async (req, res) => {
    const { checkStatus, err } = validate(req.body, uploadDocSchema)
    if (!checkStatus) return res.send(err)

    const { file } = req
    if (file === undefined) {
      return res.status(500).send({
        status: 500,
        message: 'Dose Not Exsit File'
      })
    }
    const projectId = req.body.project_id

    try {
      const link = await uploadFileToStorage(file, 'document', projectId, false)
      const doc = {
        project_id: projectId,
        path_name: link
      }
      await filesModel.createProjectDocument(doc)
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

  deleteProjectDocument: async (req, res) => {
    const { checkStatus, err } = validate(req.body, deleteSchema)
    if (!checkStatus) return res.send(err)

    // eslint-disable-next-line camelcase
    const { path_name } = req.body

    try {
      await deleteObjectStorage(path_name, 'document')
      res.status(200).send({
        status: 'success',
        url: 'Delete Document Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  uploadFileToStorage,
  deleteObjectStorage,

  getVideo: async (projectId) => {
    try {
      await filesModel.getVideo(projectId)
    } catch (err) {
      throw new Error(err)
    }
  },

  updateVideo: async (video, projectId) => {
    try {
      await filesModel.updateVideo(video, projectId)
    } catch (err) {
      throw new Error(err)
    }
  },

  getCover: async (req, res) => {
    const { checkStatus, err } = validate(req.params, getCoverSchema)
    if (!checkStatus) return res.send(err)

    const id = req.params.project_id
    try {
      const check = await checkCoverExist(id)
      if (check) {
        const coverLink = await filesModel.getCoverImage(id)
        res.status(200).send({
          id: id,
          link: coverLink[0].path_name
        })
      } else { return res.send(`Cover Imange Dose Not Exist`) }
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err
      })
    }
  }
}
