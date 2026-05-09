// Legacy Express prototype entrypoint kept intact for reference use.
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

console.log("Server is listening in " + PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/Style"));
app.use(express.static(__dirname + "/Script"));
app.use(express.static(__dirname + "/Imagens"));
app.set("view engine", "ejs");

const userRoutes = require("./routes.cjs");
userRoutes(app);

app.listen(PORT);
