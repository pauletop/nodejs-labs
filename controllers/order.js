const orderModel = require('../models/order');

class OrderController {
    async getOrdersAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            const orders = await orderModel.find();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async createOrderAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            // if order exists
            if (orderModel.findOne({ code: req.body.code })) {
                res.status(409).json({ message: "Order already exists" });
                return;
            }
            const order = await orderModel.create(req.body);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getOrderByIdAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            const order = await orderModel.findOne({ code: req.params.id });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateOrderByIdAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            const order = await orderModel.findOneAndUpdate({ code: req.params.id }, req.body, { new: true });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteOrderByIdAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            const order = await orderModel.findOneAndDelete({ code: req.params.id });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = new OrderController();