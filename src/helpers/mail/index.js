const { createTransport } = require('nodemailer');

const Activate = require('./template/activate');
const ForgotPass = require('./template/pass-forgot');
const ChangeEmail = require('./template/email-change');

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: 'flsystem@framelunch.jp',
    pass: 'framelunch1980',
  },
});

exports.activate = function (body) {
  transport.sendMail(Activate(body), err => {
    if (err) {
      console.log(err);
    }
  });
};

exports.forgotPwd = function (body) {
  transport.sendMail(ForgotPass(body), err => {
    if (err) {
      console.log(err);
    }
  });
};

exports.changeEmail = function (body) {
  transport.sendMail(ChangeEmail(body), err => {
    if (err) {
      console.log(err);
    }
  });
};
