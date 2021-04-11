const { getDB } = require('../Utility/mongoClient');
const Reply = require('../Utility/Reply');
const Mongo = require('mongodb');
const jwt = require('jsonwebtoken');
const config = require('../config');

class AuthenticationService {

    static async newUser(req, res) {
        const db = getDB();
        const reply = new Reply();
        const emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var { username, password, first_name, last_name } = req.body;
        if (!req.body || !password || !username || !first_name) {
            reply.error = 'Invalid data';
            return res.send(JSON.stringify(reply));
        }

        const user = await db.collection('Users').findOne({ Username: username });
        if (!user) {
            await db.collection('Users').save({ Username: username, Password: password, FirstName: first_name, LastName: last_name, status: false });
            reply.info = 'User Registered Successfully';
            return res.send(JSON.stringify(reply));
        }
        reply.error = 'Username Already Taken';
        return res.send(JSON.stringify(reply));
    }

    static async checkUsername(req, res) {
        const db = getDB();
        const reply = new Reply();
        const username = req.params.name;
        const user = await db.collection('Users').findOne({ Username: username });
        if (user) {
            reply.error = 'Username Already Taken';
            return res.send(JSON.stringify(reply));
        }
        reply.info = 'Username Available';
        return res.send(JSON.stringify(reply));
    }

    static async login(req, res) {
        const db = getDB();
        const reply = new Reply();
        var { username, password } = req.body;
        if (!req.body || !password || !username) {
            reply.error = 'Invalid data';
            return res.send(JSON.stringify(reply));
        }
        const user = await db.collection('Users').findOne({ Username: username, Password: password });
        if (!user) {
            reply.error = 'User does not exist with given username password combination';
            return res.send(JSON.stringify(reply));
        }
        reply.data = { first_name: user.FirstName, username: user.Username, id: user._id };
        reply.info = jwt.sign({ username: user.Username, id: user._id }, config.secretKey);
        return res.send(JSON.stringify(reply));
    }

}

module.exports = AuthenticationService;