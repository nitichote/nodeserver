import * as Knex from "knex";

export class Login {
  login(db: Knex, username: string, password: string) {
    return db("users")
      .where("username", username)
      .where("userpass", password)
      .limit(1);
  }
}
