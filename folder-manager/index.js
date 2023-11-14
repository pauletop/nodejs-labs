const createError = require("http-errors");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");
const cookiesParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("express-flash");

const indexRouter = require("./routes/index-route");
const userRouter = require("./routes/user-route");
const loginRouter = require("./routes/login-route");
const registerRoute = require("./routes/register-route");
const session = require("express-session");
const { register } = require("module");
require("./routes/connectdb");
const PORT = 3000;

express()
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "hbs")

  .use(logger("dev"))
  .use(express.urlencoded({ extended: false }))
  .use(express.json())

  .use(cookiesParser())
  .use(express.static(path.join(__dirname, "public")))
  .use(
    session({
      secret: "key",
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(flash())
  .use("/users", userRouter)
  .use("/login", loginRouter)
  .use("/register", registerRoute)
  .use("/", indexRouter)

  .use(function (req, res, next) {
    next(createError(404));
  })

  .listen(PORT, () =>
    console.log(
      `Express started on http://localhost:${PORT}, press Ctrl+C to stop.`
    )
  )

  .on("close", () => {
    console.log("Đang tắt ứng dụng...");
    connection.end((error) => {
      if (error) {
        console.error("Lỗi đóng kết nối MySQL:", error);
      } else {
        console.log("Đóng kết nối MySQL thành công!");
      }
    });
  });

/*
// Lắng nghe sự kiện Ctrl+C để tắt việc lắng nghe cổng và đóng kết nối với cơ sở dữ liệu
process.on("SIGINT", () => {
  console.log("Đang tắt ứng dụng...");

  // Đóng kết nối với cơ sở dữ liệu
  connection.end((err) => {
    if (err) {
      console.error("Lỗi khi đóng kết nối với cơ sở dữ liệu:", err.message);
    }

    // Thoát ứng dụng
    process.exit();
  });
});
*/
