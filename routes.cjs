const f = require("./functions.cjs");

module.exports = function (app) {
  app.get("/", (_req, res) => {
    res.render(__dirname + "/EJS/Home.ejs", {});
  });

  app.post("/audio", async (req, res) => {
    const audio = f.make_audio(req.body.text);
    res.send(audio);
  });
};
