const router = require('express').Router();
const bcrypt = require("bcrypt");
const conn = require('./connectdb');
const async = require('hbs/lib/async');

function find(username){
    return new Promise((resolve, reject) => {
        conn.query(`SELECT password from users WHERE username = '${username}'`, (err, res)=>{
            if (err){
                console.error("Lỗi truy vấn MySQL:", err);
                reject("Error! Please try next time.");
            } else {
                if (res.length > 0){ // exists
                    resolve(res[0].password);
                } else {
                    reject("Invalid username or password!");
                }
            }
        })
    });
}

router.get('/', (req, res)=>{
    res.render('login',{errMessage: req.flash('error')});
})
router.post('/', (req, res) => {
    let username = req.body.username ,
        password = req.body.password ,
        remember = req.body.remember;

    if (!remember){
        console.log("uncheck")
    }
    if (username === 'admin' && password === '123456') {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/');
        return;
    }
    find(username).then((hash)=>{
        return bcrypt.compare(password, hash);
    })
    .then((result)=>{
        if (result){
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/');
        } else {
            req.flash('error', 'Invalid username or password!');
            res.redirect('/login');
        }
    })
    .catch((err)=>{
        console.log(err);
        req.flash('error', err);
        res.redirect('/login');
    });
});
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/login');
    })
})

module.exports = router;