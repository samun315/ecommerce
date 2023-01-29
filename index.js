const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbconnection");
dotenv.config();
const app = express();
const {errorHandler} = require('./src/middlewares/error-handler'); 
const bodyParser = require("body-parser");
const router = require("./src/routes");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
dbConnect();  

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use("/", (req, res, next) => {
    res.send("Hello from server side");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
