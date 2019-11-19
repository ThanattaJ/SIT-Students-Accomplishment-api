require('dotenv').config()
const nodemailer = require('nodemailer')
const _ = require('lodash')
const moment = require('moment')
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
      const date = moment().format('DD-MM-YYYY')
      const { students } = data
      let studentEmail = _.filter(students, 'email')
      if (studentEmail.length > 0) {
        studentEmail = _.map(studentEmail, 'email')
        let text = `
        Hello, student\n
        <p>${user} ${status} the ${data.project_detail.project_name_en} portfolio</p> \n\n
        <p>Can see more detail in link at below. \n
        <b><u>Link:</u></b>: ${process.env.FRONT_PATH}/ProjectDetail/${projectId} </p> \n\n
        <b>Best Regard</b>, \n
        SIT Student Accomplishment
        `
        if (assignment !== null) {
          if (status === 'request') {
            projectAssignmentStatus = `Wait for admin consider the portfolio for approval or disapproval.`
          } else if (projectAssignmentStatus === 'Waiting') {
            projectAssignmentStatus = '<b>Waiting</b> the lecturer approve the portfolio'
          } else if (projectAssignmentStatus === 'Approve') {
            projectAssignmentStatus = 'Lecturer <b>approve</b> the portfolio'
          } else if (projectAssignmentStatus === 'Reject') {
            projectAssignmentStatus = `Lecturer <b>disapproval</b> the portfolio \n Comment: ${data.project_detail.comment}`
          }

          if (status === 'request') {
            text = `
            Hello, student\n
            <p>${user} ${status} the ${data.project_detail.project_name_en} portfolio for editing a portfolio</p> \n
            <p>Status Portfolio Now: ${projectAssignmentStatus}</p>\n\n
            <p>Can see more detail in link at below. \n
            <b><u>Link:</u></b>: ${process.env.FRONT_PATH}/ProjectDetail/${projectId} </p> \n\n
            <b>Best Regard</b>, \n
            SIT Student Accomplishment
            `
          } else if (status === 'consider') {
            status = _.startsWith(projectAssignmentStatus, 'Waiting', 3) ? 'Admin approve' : 'Admin disapprove'
            text = `
            Hello, student\n
            <p>${status} the ${data.project_detail.project_name_en} portfolio for editing a portfolio</p> \n
            <p>Status Portfolio Now: ${projectAssignmentStatus}</p>\n\n
            <p>Can see more detail in link at below. \n
            <b><u>Link:</u></b>: ${process.env.FRONT_PATH}/ProjectDetail/${projectId} </p> \n\n
            <b>Best Regard</b>, \n
            SIT Student Accomplishment
            `
          } else {
            text = `
            Hello, student\n
            <p>${user} ${status} the ${data.project_detail.project_name_en} portfolio in the ${assignment.course_name} subject</p> \n
            <p>Status Portfolio Now: ${projectAssignmentStatus}</p>\n\n
            <p>Can see more detail in link at below. \n
            <b><u>Link:</u></b>: ${process.env.FRONT_PATH}/ProjectDetail/${projectId} </p> \n\n
            <b>Best Regard</b>, \n
            SIT Student Accomplishment
            `
          }
        }

        let content = {
          from: 'admin.sit.student.accomplishment@gmail.com',
          to: studentEmail.toString(),
          subject: `[${date}] SIT Student Accomlishment: The ${data.project_detail.project_name_en} project is ${status}!`,
          html: text
        }
        await transporter.sendMail(content)

        if (assignment === null) {
          if (data.project_detail.haveOutsider) {
            const { outsiders } = data
            let outsiderEmail = _.filter(outsiders, 'email')
            if (outsiderEmail.length > 0) {
              outsiderEmail = _.map(outsiderEmail, 'email')
              content = {
                from: 'admin.sit.student.accomplishment@gmail.com',
                to: outsiderEmail,
                subject: `[${date}] SIT Student Accomlishment: The ${data.project_detail.project_name_en} project is ${status}!`,
                html: text
              }
              await transporter.sendMail(content)
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}
