const { ObjectId } = require('mongodb');
const database = require('../data/database');
const productsController = require('../controllers/products');

describe('Products - GET Routes (Real Database)', () => {
  let db;
  let productsCollection;
  let testProductId;

  beforeAll(done => {
    // Increase timeout for database connection
    jest.setTimeout(30000);

    database.initDatabase(err => {
      if (err) {
        console.error('Database initialization failed:', err);
        done(err);
        return;
      }
      try {
        db = database.getDatabase().db('teamproject');
        productsCollection = db.collection('products');
        done();
      } catch (e) {
        done(e);
      }
    });
  }, 35000);

  afterAll(async () => {
    if (db && productsCollection) {
      try {
        await database.getDatabase().close();
      } catch (e) {
        console.error('Error closing database:', e);
      }
    }
  });

  describe('GET /products - getAll', () => {
    test('should return all products with 200 status', async () => {
      const req = { session: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productsController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(Array.isArray(responseData)).toBe(true);
    });

    test('should return array of objects with expected fields', async () => {
      const req = { session: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productsController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];

      // If there are products, verify structure
      if (responseData.length > 0) {
        expect(responseData[0]).toHaveProperty('_id');
      }
    });
  });

  describe('GET /products/:id - getSingle', () => {
    beforeAll(async () => {
      // Insert a test product
      const testProduct = {
        productName: 'Test Product',
        price: '$19.99',
        productDescription: 'This is a test product',
      };
      const result = await productsCollection.insertOne(testProduct);
      testProductId = result.insertedId;
    });

    afterAll(async () => {
      // Clean up test product
      if (testProductId) {
        await productsCollection.deleteOne({ _id: testProductId });
      }
    });

    test('should return a single product with 200 status', async () => {
      const req = {
        objectId: testProductId,
        session: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productsController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData._id.toString()).toBe(testProductId.toString());
      expect(responseData.productName).toBe('Test Product');
      expect(responseData.price).toBe('$19.99');
    });

    test('should return 404 when product not found', async () => {
      const fakeId = new ObjectId();
      const req = {
        objectId: fakeId,
        session: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productsController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'products record not found.',
      });
    });
  });
});
