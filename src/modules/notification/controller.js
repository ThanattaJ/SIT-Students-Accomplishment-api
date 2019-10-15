require('dotenv').config()
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secureConnection: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS_MAIL
  },
  tls: {
    secureProtocol: 'TLSv1_method'
  }
})

module.exports = {

  sendEmail: async (projectId, user, data, status) => {
    try {
      const email = []
      const { students } = data
      students.map(student => {
        email.push(student.email)
      })
      let content = {
        from: 'admin.sit.student.accomplishment@gmail.com',
        to: email,
        subject: `"SIT Student Accomlishment: The ${data.project_detail.project_name_en} project is ${status}!"`,
        html: `
              Hello, \n
              <p>${user} ${status} the project's detail</p> \n\n
              <p>Can see more detail in link at below. \n
              <b><u>Link:</u></b>: https://accomplishment-sit.netlify.com/ProjectDetail/${projectId} </p> \n\n
              <b>Best Regard</b>, \n
              SIT Student Accomplishment
              `
      }
      await transporter.sendMail(content)
    } catch (err) {
      throw new Error(err)
    }
  }

}
