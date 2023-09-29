const catchError = require("../utils/catchError");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const ProductImg = require("../models/ProductImg");
const getAll = catchError(async (req, res) => {
  try {
    // Verify the token and get the user information
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    const results = await Cart.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "description"], // Add "image" to select image URL
          include: [ProductImg], // Include the associated ProductImg model
        },
      ],
      where: { userId: decodedToken.userId }, // Use the user's ID from the decoded token
    });

    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const create = catchError(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET
    );

    const result = await Cart.create({
      productId: productId,
      quantity,
      userId: decodedToken.userId,
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const getOne = catchError(async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET
    );

    const result = await Cart.findByPk(id);
    if (!result) return res.sendStatus(404);

    // Check if the user is the owner of the cart item
    if (result.userId !== decodedToken.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const remove = catchError(async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET
    );

    console.log("Request received to delete cart item with ID:", id);
    console.log("Decoded token:", decodedToken);

    const result = await Cart.findByPk(id);
    if (!result) {
      console.log("Cart item not found.");
      return res.sendStatus(404);
    }

    // Check if the user is the owner of the cart item
    if (result.userId !== decodedToken.userId) {
      console.log("User is not the owner of the cart item.");
      return res.status(403).json({ message: "Forbidden" });
    }

    await Cart.destroy({ where: { id } });
    console.log("Cart item deleted successfully.");
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const update = catchError(async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.TOKEN_SECRET
    );

    const result = await Cart.findByPk(id);
    if (!result) return res.sendStatus(404);

    // Check if the user is the owner of the cart item
    if (result.userId !== decodedToken.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedCart = await Cart.update(req.body, {
      where: { id },
      returning: true,
    });

    if (updatedCart[0] === 0) return res.sendStatus(404);
    return res.json(updatedCart[1][0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
