const customExpress = require("./config/customExpress");
const connection = require("./infra/connection");

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database connected");
    const app = customExpress();

    app.listen(3000, () => console.log("server running on port 3000"));
  }
});
