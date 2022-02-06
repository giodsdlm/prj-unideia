const connection = require("../infra/connection");

class Idea {
  create(idea, res) {
    const createdAt = new Date();

    const validIdea = [
      {
        name: "author",
        isValid: idea.author.length >= 5,
        message: "Author must have at least 5 characters!",
      },
      {
        name: "title",
        isValid: idea.title.length > 0,
        message: "Title can't be empty!",
      },
      {
        name: "content",
        isValid: idea.content.length > 0,
        message: "Content can't be empty!",
      },
    ];

    const errors = validIdea.filter((field) => !field.isValid);

    if (errors.length) {
      res.status(400).json(errors);
    } else {
      const objIdea = { ...idea, createdAt };

      const sql = "INSERT INTO Ideas SET ?";

      connection.query(sql, objIdea, (err, result) => {
        if (err) res.status(400).json(err);
        else {
          res.status(201).json(result);
        }
      });
    }
  }
}

module.exports = new Idea();
