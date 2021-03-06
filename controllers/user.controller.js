const express = require('express');
const { jwtAuthenticated } = require('../utilities/auth.util');
const userController = express.Router();
const userManager = require("../managers/user.manager");
const {
  sendEmail
} = require("../utilities/mailer.util");
const {
  allowUserCreation
} = require("../config/env.config");

userController.get('/', jwtAuthenticated, (req, res) => {
  userManager.getAllUsers()
  .then((users) => {
    res.send({
      users: users
    });
  })
  .catch((err) => {
    res.statusCode = 500;
    res.send(err);
  });
});

userController.get('/:id', jwtAuthenticated, (req, res) => {
  const id = req.params.id;
  userManager.getSingleUser(id)
  .then((user) => {
    res.send(user);
  })
  .catch((err) => {
    res.statusCode = 500;
    res.send(err);
  });
});

userController.post('/', (req, res) => {
  if (allowUserCreation.toLowerCase() !== "true") {
    res.statusCode = 400;
    res.send(err);
  }
  const user = req.body;
  userManager.register(user)
  .then((registrationResponse) => {
    const recipient = user.email;
    const subject = "Welcome to Andrew Overton Portfolio!";
    const message = `Your temporary password is ${registrationResponse.newPassword}. (${new Date()})`;
    sendEmail(recipient, subject, message);
    res.send({
      message: registrationResponse.message
    });
  })
  .catch((err) => {
    res.statusCode = 500;
    res.send(err);
  });
});

userController.put('/passwordReset', (req, res) => {
  const email = req.body.email;
  userManager.resetPassword(email)
  .then((response) => {
    const recipient = email;
    const subject = "Password Reset";
    const message = `Your new password is ${response.newPassword}`;
    sendEmail(recipient, subject, message);
    res.send({
      message: "Password reset"
    });
  })
  .catch((err) => {
    const recipient = email;
    const subject = "Password Reset Attempted";
    const message = `Unable to reset password for Andrew Overton Portfolio. Are you sure this email address is registered?`;
    sendEmail(recipient, subject, message);
    res.statusCode = 500;
    res.send(err);
  });
});

module.exports = userController;