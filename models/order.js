const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    total: {
        type: Number,
        required: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ]
});

module.exports = model('Order', orderSchema);