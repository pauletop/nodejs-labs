const accountModel = require('../models/account');
const jwt = require('jsonwebtoken');

class AccountController {
    // [POST] /api/account/register
    async registerAPI(req, res) {
        console.log(req.body);
        var result;
        if (req.body.name === undefined ){
            const { email, password } = req.body;
            if (email === undefined || password === undefined) return res.json({ error: true, message: 'Invalid data' });
            result = await accountModel.register(undefined, email, password);
        } else {
            const { name, email, password } = req.body;
            if (email === undefined || password === undefined) return res.json({ error: true, message: 'Invalid data' });
            result = await accountModel.register(name, email, password);
        }
        res.json({message: 'Register successfully', result});
    }

    // [POST] /api/account/login
    async loginAPI(req, res) {
        const { email, password } = req.body;
        if (email === undefined || password === undefined) return res.json({ error: true, message: 'Invalid data' });
        var result = await accountModel.login(email, password);
        if (!result.error) {
            req.session.login = result;
            let token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            result = { message: 'Login successfully', token: token, ...result["_doc"] };
        }
        res.json(result);
    }
}

module.exports = new AccountController();