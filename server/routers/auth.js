const router = require('express').Router();
const verify = require('./verifyToken');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    
const dotenv = require('dotenv');
dotenv.config();

const connection = require('../database/connectDB');

const schema = Joi.object({
    username: Joi.string().min(3).required(),
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email()
});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});


router.post('/register', async function (req, res) {

    const validation = schema.validate(req.body);
    if (validation.error) return res.status(422).send({ errorTarget: validation.error.details[0].path[0], errorMessage: validation.error.details[0].message});

    try{
        const salt = await bcrypt.genSaltSync(10);
        hashPassword = await bcrypt.hash(req.body.password, salt);

        connection.query(
            `INSERT INTO users (username, firstname, lastname, email, password) VALUES ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${hashPassword}');`,
            function(err, result) {
                if (!err) {
                    res.status(201);
                    const token = jwt.sign({ _id: result.insertId}, process.env.SECRET_TOKEN);
                    res.header('Authorization', token).send({ id: result.insertId, token: token});
                }
                else {
                    err.errno === 1062 && res.status(400).send("user already exist");
                    console.log(err);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', function (req, res) {

    const validation = loginSchema.validate(req.body);
    if (validation.error) return res.status(422).send({ errorTarget: validation.error.details[0].path[0], errorMessage: validation.error.details[0].message});

    try{
        connection.query(
            `SELECT * FROM users WHERE email = '${req.body.email}';`,
            function(err, results) {
                if (!err) {
                    if (results.length === 0) res.status(401).send({ errorTarget: 'email', errorMessage: 'Wrong Email'});
                    else{
                        const validPass = bcrypt.compareSync(req.body.password, results[0].password);
                        if (!validPass) return res.status(401).send({ errorTarget: 'password', errorMessage: 'Wrong Password'});

                        const token = jwt.sign({ _id: results[0].id}, process.env.SECRET_TOKEN);
                        res.header('Authorization', token).send({ id: results[0].id, username: results[0].username, email: results[0].email, token: token});
                    }
                    
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get('/checkToken', verify, (req, res) => {
    res.status(200).send();
});


module.exports = router;