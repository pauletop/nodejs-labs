const productModel = require('../models/product');

class ProductController {
    async getProductsAPI(req, res) {
        try {
            const products = await productModel.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async createProductAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            // if product exists
            if (productModel.findOne({ code: req.body.code })) {
                res.status(409).json({ message: "Product already exists" });
                return;
            }
            const product = await productModel.create(req.body);
            res.status(200).json({ message: "Add product successfully", product});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getProductByIdAPI(req, res) {
        try {
            const product = await productModel.findOne({ code: req.params.id });
            if (!product) {res.status(404).json({ message: "Product not found" }); return;}
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateProductByIdAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            const updatedProduct = await productModel.findOneAndUpdate({ code: req.params.id }, req.body, { new: true });
            res.status(200).json({ message: "Product updated", updatedProduct});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteProductByIdAPI(req, res) {
        if (!req.session.login){
            res.status(401).json({message: "You must login to do this action"});
            return;
        }
        try {
            const deletedProduct = await productModel.findOneAndDelete({ code: req.params.id });
            res.status(200).json({ message: "Product deleted", deletedProduct});
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = new ProductController();