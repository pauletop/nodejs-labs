const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = new Schema({
        name: { type: String },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
});

accountSchema.statics.register = async function(name, email, password) {
    if (await this.findOne({ email: email })) {
        return { error: 'Email already exists' };
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const account = new this({ name: name, passwordHash: hashPassword, email: email });
    return account.save();
};

accountSchema.statics.login = async function(email, password) {
    const account = await this.findOne({ email: email });
    if (!account) {
        return { error: 'Account does not exist' };
    }

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
        return { error: 'Wrong password' };
    }

    return account;
};

module.exports = model('Account', accountSchema);