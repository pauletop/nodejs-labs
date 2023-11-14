const router = require('express').Router();
const productController = require("./../controllers/product");
const authMiddleware = require('../middlewares/auth');

// GET api/products
router.get("/", productController.getProductsAPI);
// POST api/products
router.post("/", authMiddleware, productController.createProductAPI);
// GET api/products/:id
router.get("/:id", productController.getProductByIdAPI);
// PUT api/products/:id
router.put("/:id", authMiddleware, productController.updateProductByIdAPI);
// DELETE api/products/:id
router.delete("/:id", authMiddleware, productController.deleteProductByIdAPI);

module.exports = router;