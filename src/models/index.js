const Cart = require("./Cart");
const Category = require("./Category");
const Product = require("./Product");
const ProductImg = require("./ProductImg");
const Purchase = require("./Purchase");
const User = require("./User");

Product.belongsTo(Category);
Category.hasMany(Product);

Product.hasMany(ProductImg);
ProductImg.belongsTo(Product);

Product.hasMany(Cart);
Cart.belongsTo(Product);

User.hasMany(Cart);
Cart.belongsTo(User);

User.hasMany(Purchase);
Purchase.belongsTo(User);

Purchase.belongsTo(Product);
Product.hasMany(Purchase);
