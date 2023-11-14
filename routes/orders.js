const router = require('express').Router();
const orderController = require("./../controllers/order");

// GET api/orders
router.get("/", orderController.getOrdersAPI);
// POST api/orders
router.post("/", orderController.createOrderAPI);
// GET api/orders/:id
router.get("/:id", orderController.getOrderByIdAPI);
// PUT api/orders/:id
router.put("/:id", orderController.updateOrderByIdAPI);
// DELETE api/orders/:id
router.delete("/:id", orderController.deleteOrderByIdAPI);

module.exports = router;