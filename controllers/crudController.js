const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getCollection = (collectionName) => {
  return mongodb.getDatabase().db().collection(collectionName);
};

const isValidObjectId = (id) => ObjectId.isValid(id);

const createCrudController = (collectionName) => {
  const getAll = async (req, res) => {
    try {
      const items = await getCollection(collectionName).find().toArray();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: `Failed to get ${collectionName}.` });
    }
  };

  const getSingle = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id format.' });
    }

    try {
      const item = await getCollection(collectionName).findOne({
        _id: new ObjectId(id),
      });

      if (!item) {
        return res.status(404).json({ message: `${collectionName} record not found.` });
      }

      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: `Failed to get ${collectionName} record.` });
    }
  };

  const create = async (req, res) => {
    try {
      const result = await getCollection(collectionName).insertOne(req.body);
      res.status(201).json({
        message: `${collectionName} record created.`,
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ message: `Failed to create ${collectionName} record.` });
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { _id, ...updatedRecord } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id format.' });
    }

    try {
      const result = await getCollection(collectionName).updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRecord }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: `${collectionName} record not found.` });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: `Failed to update ${collectionName} record.` });
    }
  };

  const remove = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id format.' });
    }

    try {
      const result = await getCollection(collectionName).deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: `${collectionName} record not found.` });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: `Failed to delete ${collectionName} record.` });
    }
  };

  return {
    getAll,
    getSingle,
    create,
    update,
    delete: remove,
  };
};

module.exports = createCrudController;
