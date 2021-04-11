const config = require('../config');
const { getDB } = require('../Utility/mongoClient');
const Reply = require('../Utility/Reply');
const Mongo = require('mongodb');
const jwt = require('jsonwebtoken');

class InventoryService {

  static async fetchBooks(req, res) {
    const reply = new Reply();
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'Permission Denied' });
    }
    try {
      const token = req.get('authorization');
      jwt.verify(token, config.secretKey);
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: 'Permission Denied' });
    }
    const db = getDB();
    const userId = jwt.decode(req.get('authorization')).id;
    const bookList = await db.collection('Books').find({ user_id: userId, deleted: false }).toArray();
    reply.data = bookList;
    return res.send(JSON.stringify(reply));
  }

  static async addBook(req, res) {
    const reply = new Reply();
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'Permission Denied' });
    }
    try {
      const token = req.get('authorization');
      jwt.verify(token, config.secretKey);
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: 'Permission Denied' });
    }
    const db = getDB();
    const userId = jwt.decode(req.get('authorization')).id;
    const { book_name, author, description, google_id, quantity, _id } = req.body;
    let dbData = {
      user_id: userId, book_name, author, description, deleted: false,
      google_id, quantity
    };
    if (_id) {
      dbData._id = new Mongo.ObjectID(_id)
    }
    const addedBook = await db.collection('Books').save(dbData);
    reply.data = addedBook["ops"][0];
    return res.send(JSON.stringify(reply));
  }

  static async deleteBook(req, res) {
    const reply = new Reply();
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'Permission Denied' });
    }
    try {
      const token = req.get('authorization');
      jwt.verify(token, config.secretKey);
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: 'Permission Denied' });
    }
    const db = getDB();
    const userId = jwt.decode(req.get('authorization')).id;
    const book_id = req.params.bookId;
    const addedBook = await db.collection('Books').updateOne({
      user_id: userId, _id: new Mongo.ObjectID(book_id)
    }, {
      $set: { deleted: true }
    });
    reply.data = addedBook;
    return res.send(JSON.stringify(reply));
  }

  static async fetchUsers(req, res) {
    const reply = new Reply();
    if (!req.headers.authorization) {
      reply.error = 'Permission Denied';
      // return res.send(JSON.stringify(reply));
      return res.status(403).json({ error: 'Permission Denied' });
    }
    let id;
    try {
      const token = req.get('authorization');
      id = jwt.verify(token, config.secretKey).id;
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: 'Permission Denied' });
    }
    const db = getDB();

    const userList = await db.collection('Users').find({ _id: { $ne: new Mongo.ObjectID(id) } }, { projection: { Password: 0 } }).toArray();
    reply.data = userList;
    return res.send(JSON.stringify(reply));
  }

  static async changeStatus(id, bool) {
    const db = getDB();
    await db.collection('Users').updateOne({ _id: new Mongo.ObjectID(id) }, { $set: { status: bool } }).catch(err => console.error(err));
    return;
  }

}

module.exports = InventoryService;