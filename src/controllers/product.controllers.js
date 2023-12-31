const catchError = require("../utils/catchError");
const Product = require("../models/Product");
const ProductImg = require("../models/ProductImg");
const { Op } = require("sequelize");
const Category = require("../models/Category");

const getAll = catchError(async (req, res) => {
  console.log(req.query);
  const { categoryId, name } = req.query;
  const where = {};
  if (name) where.name = { name: { [Op.iLike]: `%${name}%` } };
  if (categoryId) where.categoryId = categoryId;
  const results = await Product.findAll({
    include: [Category, ProductImg],
    where,
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const result = await Product.create(req.body);
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Product.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Product.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const setProductImgs = catchError(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.setProductImgs(req.body);
  const images = await product.getProductImgs();
  return res.json(images);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  setProductImgs,
};
