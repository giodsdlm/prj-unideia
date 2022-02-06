module.exports = (app) => {
  app.get("/home", (req, res) => res.send("Bem vindo ao Portal Unideia! :)"));

  app.post("/home", (req, res) => {
    console.log(req.body);
    res.send("data sent to home: " + JSON.stringify(req.body));
  });
};
