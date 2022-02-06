class Tables {
  init(connection) {
    this.connection = connection;
    this.createIdeas();
  }

  createIdeas() {
    const sql =
      "CREATE TABLE IF NOT EXISTS Ideas (id int NOT NULL AUTO_INCREMENT, author varchar(50) NOT NULL, title varchar(30) NOT NULL, content varchar(100) NOT NULL, createdAt datetime NOT NULL, PRIMARY KEY (id))";

    this.connection.query(sql, (err) => {
      if (err) console.log(err);
    });
  }
}

module.exports = new Tables();
