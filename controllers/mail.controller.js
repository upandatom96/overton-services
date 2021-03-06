const express = require('express');
const mailController = express.Router();
const {
  sendEmailToSelf
} = require("../utilities/mailer.util");

mailController.post('/', (req, res) => {
  const messageDetails = req.body;
  if (!messageDetails.emailAddress) {
    res.status(400);
    res.json({ "message": "email address not given" });
  } else if (!messageDetails.message) {
    res.status(400);
    res.json({ "message": "message not given" });
  } else {
    const subject = `Contacted by ${messageDetails.emailAddress}`;
    const message = `Message: ${messageDetails.message}`;
    sendEmailToSelf(subject, message);
    res.send({
      message: "Mail success"
    });
  }
});

module.exports = mailController;