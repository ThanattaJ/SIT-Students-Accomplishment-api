const express = require('express')
const router = express.Router()
const controller = require('./controller')

const upload = controller.multerConfig()

router.post('/image', upload.single('file'), controller.pictureUpload)

router.post('/document', upload.single('file'), controller.documentUpload)

module.exports = router
