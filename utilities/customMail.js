//create OTP using random method
const nodemailer = require("nodemailer");
exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randomOTP = Math.round(Math.random() * 9);
    otp = otp + randomOTP;
  }
  return otp;
};
exports.sendMail = async (OTP,email) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'raw123para@gmail.com',
            pass:'nnry cxjx yyys vayp'
        }
    })
    const mailOptions = {
        from: 'raw123para@gmail.com',
        to:`${email}`, //'wilixo8315@othao.com'
        subject: 'Your one time otp is',
        html: `<h1>This is one time password: ${OTP}</h1>`
    }
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Email Sent')
        console.log(OTP)
    } catch (error) {
        console.log(error)
    }
  };


//   async function sendMail(email,OTP){
//     const transporter = nodemailer.createTransport({
//         service:'gmail',
//         auth:{
//             user:'raw123para@gmail.com',
//             pass:'nnry cxjx yyys vayp'
//         }
//     })
//     const mailOptions = {
//         from: 'raw123para@gmail.com',
//         to:'sumanthdevadiga360@gmail.com',
//         subject: 'Your one time otp is ',
//         text: '1234'
//     }
//     try {
//         const result = await transporter.sendMail(mailOptions);
//         console.log('Email Sent')
//     } catch (error) {
//         console.log(error)
//     }
//   }


