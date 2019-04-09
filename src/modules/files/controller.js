require('dotenv').config()
const admin = require('firebase-admin')
const filesModel = require('./model')

module.exports = {
  test: async () => {
    const serviceAccount = require('../../../config/senior-project-c9108-firebase-adminsdk-7yj59-b31c4fcf83.json')

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.firebase_storageBucket
    })

    const bucket = admin.storage().bucket()
    console.log(bucket)
  },

  getVideo: async (projectId) => { await filesModel.getVideo(projectId) },
  updateVideo: async (video, projectId) => { await filesModel.updateVideo(video, projectId) }

}
