require('dotenv').config()
const nodemailer = require('nodemailer')
const _ = require('lodash')
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

  sendEmail: async (projectId, user, data, status, assignment, projectAssignmentStatus) => {
    try {
      const { students } = data
      const studentEmail = _.map(students, 'email')
      let text = `
      Hello, \n
      <p>${user} ${status} the ${data.project_detail.project_name_en} project</p> \n\n
      <p>Can see more detail in link at below. \n
      <b><u>Link:</u></b>: https://accomplishment-sit.netlify.com/ProjectDetail/${projectId} </p> \n\n
      <b>Best Regard</b>, \n
      SIT Student Accomplishment
      `
      if (assignment !== null) {
        if (projectAssignmentStatus === 'Waiting') {
          projectAssignmentStatus = '<b>Waiting</b> the lecturer approve the project'
        } else if (projectAssignmentStatus === 'Approve') {
          projectAssignmentStatus = 'Lecturer <b>approve</b> the project'
        } else if (projectAssignmentStatus === 'Reject') {
          projectAssignmentStatus = `Lecturer <b>reject</b> the project \n Comment: ${data.project_detail.comment}`
        }

        text = `
        Hello, \n
        <p>${user} ${status} the ${data.project_detail.project_name_en} project in the ${assignment.course_name} subject</p> \n
        <p>Status: ${projectAssignmentStatus}</p>\n\n
        <p>Can see more detail in link at below. \n
        <b><u>Link:</u></b>: https://accomplishment-sit.netlify.com/ProjectDetail/${projectId} </p> \n\n
        <b>Best Regard</b>, \n
        SIT Student Accomplishment
        `
      }

      let content = {
        from: 'admin.sit.student.accomplishment@gmail.com',
        to: studentEmail,
        subject: `"SIT Student Accomlishment: The ${data.project_detail.project_name_en} project is ${status}!"`,
        html: text
      }
      await transporter.sendMail(content)

      if (assignment === null) {
        if (data.project_detail.haveOutsider) {
          const { outsiders } = data
          const outsiderEmail = _.map(outsiders, 'email')
          content = {
            from: 'admin.sit.student.accomplishment@gmail.com',
            to: outsiderEmail,
            subject: `"SIT Student Accomlishment: The ${data.project_detail.project_name_en} project is ${status}!"`,
            html: text
          }
          await transporter.sendMail(content)
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}
