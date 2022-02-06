const Ideas = require("../models/ideas");

module.exports = (app) => {
  app.get("/home", (req, res) => res.send("Bem vindo ao Portal Unideia! :)"));

  app.post("/home", (req, res) => {
    const idea = req.body;
    Ideas.create(idea, res);
  });
};
