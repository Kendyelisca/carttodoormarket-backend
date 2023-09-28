const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");

const getAll = catchError(async (req, res) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET
    );

    const results = await Purchase.findAll({
      where: { userId: decodedToken.userId }, // Use the user's ID from the decoded token
    });

    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const buyCart = catchError(async (req, res) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET
    );

    const userId = decodedToken.userId;

    await Purchase.destroy({ where: { userId } });
    const cartProducts = await Cart.findAll({
      where: { userId },
      attributes: ["userId", "productId", "quantity"],
      raw: true,
    });
    await Purchase.bulkCreate(cartProducts);
    await Cart.destroy({ where: { userId } });
    return res.json(cartProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  getAll,
  buyCart,
};
