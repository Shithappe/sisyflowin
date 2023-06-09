const router = require('express').Router();
const verify = require('./verifyToken');
const Joi = require('@hapi/joi');

const connection = require('../database/connectDB');

const wishSchema = Joi.object({
    name: Joi.string().required(),
    link: Joi.string(),
    price: Joi.string()
});


router.get('/', verify, (req, res) => {
    try{
        connection.query(
            `SELECT wishs.id, name, link, price, user_id, users.username, users.email from wishs join users on wishs.user_id = users.id WHERE user_id = ${req.user._id}
            UNION
            SELECT  wishs.id, name, link, price, user_id, username, email FROM wishs join share on wishs.user_id = share.sender_id join users on wishs.user_id = users.id WHERE recipient_id = ${req.user._id} AND accepted = 1 ORDER BY user_id;`,
            function(err, result) {
                if (!err) {
                    res.status(200).send(result);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.patch('/', verify, (req, res) => {
    try{
        connection.query(
            `UPDATE wishs SET name = '${req.body.name}', link = '${req.body.link}', price = '${req.body.price}' WHERE id = ${req.body.id}`,
            function(err) {
                if (!err) {
                    res.sendStatus(200);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.delete('/', verify, (req, res) => {
    try{
        connection.query(
            `DELETE FROM WISHS WHERE id = ${req.body.id}`,
            function(err) {
                if (!err) {
                    res.sendStatus(203);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get('/users', verify, (req, res) => { 
    try{
        connection.query(
            `select id, username, email from users where id != ${req.user._id};`,
            function(err, result) {
                if (!err) {
                    res.status(200).send(result);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/add', verify, (req, res) => {

    const validation = wishSchema.validate(req.body);
    if (validation.error) return res.status(422).send(validation.error.details[0].message);

    try{
        connection.query(
            `INSERT INTO wishs (name, link, price, user_id) VALUES ('${req.body.name}', '${req.body.link}', '${req.body.price}', '${req.user._id}');`,
            function(err) {
                if (!err) {
                    res.sendStatus(201);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
})

router.post('/share', verify, (req, res) => {
    try{
        connection.query(
            `INSERT INTO share (sender_id, recipient_id) VALUES ('${req.user._id}', '${req.body.recipient_id}');`,
            function(err) {
                if (!err) {
                    res.sendStatus(201);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
})

router.patch('/share', verify, (req, res) => {
    console.log(`UPDATE share SET accepted = ${req.body.accepted} WHERE recipient_id = ${req.user._id} AND sender_id = ${req.body.sender_id}`);
    console.log(`recipient_id = ${req.user._id}`);
    console.log(`sender_id = ${req.body.sender_id}`);
    
    try{
        connection.query(
            `UPDATE share SET accepted = ${req.body.accepted} WHERE recipient_id = ${req.user._id} AND sender_id = ${req.body.sender_id}`,
            function(err) {
                if (!err) {
                    res.sendStatus(200);
                }
            }
        );
    }
    // UPDATE share SET accepted = 1 WHERE recipient_id = 26 AND sender_id = 41
    catch(err){
        res.status(400).send(err);
    }
})

router.get('/notification', verify, (req, res) => {
    try{
        connection.query(
            `select s.id, u.id, username, email from users u join share s on (u.id=s.sender_id) where s.recipient_id = ${req.user._id} and s.accepted = 0;`,
            function(err, result) {
                if (!err) {
                    res.status(200).send(result);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
})

router.delete('/notification', verify, (req, res) => {
    try{
        connection.query(
            `DELETE FROM SHARE WHERE id = ${req.body.id}`,
            function(err) {
                if (!err) {
                    res.sendStatus(203);
                }
            }
        );
    }
    catch(err){
        res.status(400).send(err);
    }
});

module.exports = router