const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth");

module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be at least 8 charaters" });
  } else {
    let newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((user) =>
        res.status(201).send({ message: "Registered Successfully", user })
      )
      .catch((err) => {
        console.error("Error in saving:", err);
        return res.status(500).send({ error: "Erro in save" });
      });
  }
};

// module.exports.loginUser = (req, res) => {
//   if (req.body.email.includes("@")) {
//     return User.findOne({ email: req.body.email })
//       .then((result) => {
//         if (result == null) {
//           // if the email is not found, send a message 'No email found'.
//           return res.status(404).send({ message: "No email found" });
//         } else {
//           const isPasswordCorrect = bcrypt.compareSync(
//             req.body.password,
//             result.password
//           );
//           if (isPasswordCorrect) {
//             // if all needed requirements are achieved, send a success message 'User logged in successfully' and return the access token.
//             return res.status(200).send({
//               message: "User logged in successfully",
//               access: auth.createAccessToken(result),
//             });
//           } else {
//             // if the email and password is incorrect, send a message 'Incorrect email or password'.
//             return res
//               .status(401)
//               .send({ message: "Incorrect email or password" });
//           }
//         }
//       })
//       .catch((error) => errorHandler(error, req, res));
//   } else {
//     // if the email used in not in the right format, send a message 'Invalid email format'.
//     return res.status(400).send({ message: "Invalid email format" });
//   }
// };
module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        if (!result) {
          // if the email is not found, send a message 'No email found'.
          return res.status(404).json({ message: "No email found" });
        }

        // Compare the password
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        if (isPasswordCorrect) {
          // Create access token including the username
          const token = auth.createAccessToken(result);
          console.log(result);

          // if all requirements are met, send success message and return token
          return res.status(200).json({
            message: "User logged in successfully",
            access: token,
          });
        } else {
          // if the password is incorrect
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } else {
    // if the email is not in the correct format
    return res.status(400).json({ message: "Invalid email format" });
  }
};
//Get users details
module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        // if the user has invalid token, send a message 'invalid signature'.
        return res.status(404).send({ message: "invalid signature" });
      } else {
        // if the user is found, return the user.
        user.password = "";
        return res.status(200).send(user);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
