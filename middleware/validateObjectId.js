const { ObjectId } = require('mongodb');

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id format.' });
  }

  req.objectId = new ObjectId(id);
  next();
};

module.exports = validateObjectId;
