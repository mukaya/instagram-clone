const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
//const requireLogin = require("../middleware/requireLogin");

router.post("/signup", (request, response, next) => {
  const { name, email, password, pic } = request.body;
  if (!name || !email || !password) {
    return response.status(422).json({ error: "please enter all fields" });
  }
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return response.status(422).json({ error: "Invalid email" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return response.status(422).json({ error: "this email is already used" });
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              name,
              email,
              password: hashedPassword,
              pic
            });
            user
              .save()
              .then((user) => {
                return response.json({ message: "saved successfuly" });
              })
              .catch((error) => {
                return response.json({ error: error });
              });
          })
          .catch((error) => {
            return response.json(error);
          });
      }
    })
    .catch((error) => {
      return response.json({ error: error });
    });
});

router.post("/signin", (request, response, next) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return response.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return response
          .status(422)
          .json({ Error: "Invalid email or password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser;
            return response.json({ token, user: { _id, name, email, followers, following, pic } });
          } else {
            return response
              .status(422)
              .json({ error: "Invalid email or password" });
          }
        })
        .catch((error) => {
          return response.json({ error: error });
        });
    })
    .catch((error) => {
      return response.status(422).json({ rrror: error });
    });
});
module.exports = router;
