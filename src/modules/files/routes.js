const express = require('express')
const router = express.Router()
const controller = require('./controller')

const uploadImg = controller.multerImageConfig()
router.post('/image', uploadImg.single('file'), controller.imageUpload)

const uploadDoc = controller.multerDocumentConfig()
router.post('/document', uploadDoc.single('file'), controller.documentUpload)

module.exports = router
