const mongoose = require('mongoose');

const connect = async (url) => {
    try {
        await mongoose.connect(url);
        console.log('\nConnect to DB successfully !!!');
    } catch (error) {
        console.log('\nConnect to DB failed !!!');
        console.log(error);
    }
};

module.exports = { connect };