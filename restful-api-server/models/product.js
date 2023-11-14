const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        min: 3,
        max: 50,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    }
});

module.exports = model('Product', productSchema);