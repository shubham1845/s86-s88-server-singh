const jwt = require("jsonwebtoken");
const secret = "BlogPOST";
// require("dotenv").config();

module.exports.createAccessToken = (user) => {
  // The data will be received from the registration form
  // When the user logs in, a token will be create with user's information
  const data = {
    id: user._id,
    email: user.email,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, secret, {});
};

// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);

  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No token." });
  } else {
    console.log(token);
    token = token.slice(7, token.length);
    console.log(token);

    // [SECTION] Token Decryption
    jwt.verify(token, secret, function (err, decodedToken) {
      if (err) {
        return res.status(403).send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        console.log("result from verify method:");
        console.log(decodedToken);

        req.user = decodedToken;

        next();
      }
    });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  // console.log("result from verifyAdmin method: ");
  // console.log(req.user);
  // next();

  // Check if the owner of the token is an admin
  if (req.user.isAdmin) {
    // if it is, move to the next middleware/controller using next()
    next();
  } else {
    // if not an admin, end the req-res cycle by sending appropriate response
    //and status code
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};

// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
  // Log the error
  console.log(err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  // Send a standardized response
  res.json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};
