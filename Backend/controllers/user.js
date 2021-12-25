const bcrypt = require("bcrypt");
// const User = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("password-validator");
const connection = require("../db");

let schema = new validator();

schema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

exports.signup = async (req, res, next) => {
  try {
    if (!schema.validate(req.body.password))
      throw new Error(
        "Le mot de passe doit contenir 8 caractères au minimum dont au moins une majuscule et un chiffre"
      );

    const hash = await bcrypt.hash(req.body.password, 10);
    await connection.query(
      `INSERT INTO users (email, password) VALUES (req.body.email, hash)`,
      (err) => {
        if (err) throw err;

        res.status(200).json({ message: "Compte créé" });
      }
    );
  } catch (err) {
    res.status(400).json({ err });
  }
};
exports.login = async (req, res, next) => {
  try {
    await connection.query(
      `SELECT * FROM users WHERE email===req.body.email`,
      (err, result) => {
        if (err) throw err;
        if (!result)
          res.status(404).json({ message: "Utilisateur non trouvé!" });
        const valid = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!valid) {
          return res.status(401).json({ message: "Mot de passe incorrect !" });
        }
        res.status(200).json({
          userId: result[0].id,
          token: jwt.sign({ userId: result[0].id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
        });
      }
    );
  } catch (err) {
    res.status(err.statusCode).json({ err });
  }
};
