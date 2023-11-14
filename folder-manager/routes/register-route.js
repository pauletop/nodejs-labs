const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const conn = require("./connectdb");
const async = require("hbs/lib/async");
const saltRounds = 10;

async function exists(username) {
  var flg = true;
  await conn.query(
    `SELECT username from users WHERE username = '${username}'`,
    (err, res) => {
      if (err) {
        console.error("Lỗi truy vấn MySQL:", err);
        res.status(500).send("Error! Please try next time.");
      } else {
        if (!res){ // not exists
          console.log(res, JSON.parse(res));
          flg = false;
        }
      }
    }
  );
  return flg;
}

router.get("/", (req, res) => {
  res.render("register", { errMess: req.flash("error") });
});

router.post(
  "/",
  [
    body("fullname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Invalid full name! Please try again"),
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Invalid username! Please try again"),
    body("email").isEmail().withMessage("Invalid email! Please try again"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 characters!"),
  ],
  async (req, res) => {
    // FORM VALIDATE
    const result = validationResult(req);
    let formdata = req.body,
      username = formdata.username,
      pwd = formdata.password,
      confirmpwd = formdata.confirmpwd;
    if (Object.keys(formdata).some((key) => formdata[key] == "")) {
      req.flash("error", "Please fill all required fields!");
      res.redirect("/register");
      return;
    }
    if (!result.isEmpty()) {
      req.flash("error", result.array()[0].msg);
      res.redirect("/register");
      return;
    }
    if (pwd !== confirmpwd) {
      req.flash("error", "Confirmation password is incorrect!");
      res.redirect("/register");
      return;
    }
    if (exists(username)){
      req.flash("error", "Username already exists, please try again!")
    }
    
    // ADD USER
    var hashpwd;
    await bcrypt.hash(pwd, saltRounds, (err, hash)=>{
      if (err){
        console.error("Lỗi mã hóa mật khẩu:", err);
        res.status(500).send("Error! Please try next time.");
      }
      hashpwd = hash;
      var sql = 'INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)',
          values = [formdata.fullname, formdata.username, formdata.email, hashpwd];
      conn.query(sql, values, (err, result)=>{
        if (err) {
          console.error('Lỗi truy vấn MySQL:', err);
          res.status(500).send('Error! Please try next time.');
        } else {
          console.log('Dữ liệu đã được thêm vào cơ sở dữ liệu:', result);
          res.send('Sign up successfully!');
        }
      });
    });
  }
);
module.exports = router;
