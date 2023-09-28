const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and store the decoded token in a variable
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken);

    // Set the decoded token in the req object
    req.decodedToken = decodedToken;

    next();
  } catch (error) {
    console.error(error); // Log the error
    return res.sendStatus(403);
  }
};

module.exports = verifyJWT;
