import express from "express";
import logger from "morgan";

const PORT = 4000;

const app = express();

const urlLogger = (req, res, next) => {
  console.log(`Path: ${req.url}`);
  next();
};

const timeLogger = (req, res, next) => {
  const today = new Date();
  console.log(
    `Time: ${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`
  );
  next();
};

const securityLogger = (req, res, next) => {
  if (req.protocol === "https") {
    console.log("secure");
  } else {
    console.log("insecure");
  }
  next();
};

const handleHome = (req, res) => {
  return res.send("<h2>Have a nice day!</h2>");
};

const protectedLogger = (req, res) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
};

const morganLogger = logger("dev");

app.use(morganLogger);
app.use(urlLogger);
app.use(timeLogger);
app.use(securityLogger);
app.get("/", handleHome);
app.get("/protected", protectedLogger);

const handleListening = () =>
  console.log(`server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
