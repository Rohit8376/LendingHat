const nodemailer = require("nodemailer");
const { SERVICE_EMAIL } = require("../constants/constants");

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'shyamwinner18@gmail.com',
//     pass: 'Shyamwinner@108',
//   },
// });

module.exports.sendEmail = async function (options) {
  try {
    const transporter = nodemailer.createTransport({
      // host: "smtp.gmail.com",
      // port: 465,
      // secure: true,
      service: "gmail",
      auth: {
        user: "resetrelai@gmail.com",
        pass: "orlbdcrjrjalavji"
      },
    });

    const mailOptions = {
      from: "resetrelai@gmail.com",
      to: options.to,
      subject: options.subject,
      html: options?.html,
      attachments: options.attachments,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
