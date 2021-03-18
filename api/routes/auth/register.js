const database = require("../../database/Database");
const mysql = require("mysql");

const emailRegex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])";
// Minimum 8 characters, uppercase, lowercase, number, special char
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm;

module.exports = async (req, res) => {
    const db = database.instance.con;
    let data = req.body;
    if (data.email && data.password) {
        db.query("SELECT email FROM users WHERE email = ? ;", [data.email], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                if (data.email.match(emailRegex)) {
                    if (data.password.match(passwordRegex)) {
                        res.status(200).send("Hoorayy!");
                    } else {
                        res.status(400).json({
                            error: "Password does not meet requirements!",
                            code: 1003
                        });
                    }
                } else {
                    res.status(400).json({
                        error: "Invalid email!",
                        code: 1002
                    });
                }
            } else {
                res.status(400).json({
                    error: "Email already registered!",
                    code: 1001
                });
            }
        });
    } else {
        res.status(400).json({
            error: "Bad request",
            code: 1000
        });
    }
}