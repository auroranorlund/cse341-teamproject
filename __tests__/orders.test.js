const { ObjectId } = require('mongodb');
const database = require('../data/database');
const ordersController = require('../controllers/orders');

describe('Orders - GET Routes (Real Database)', () => {
  let db;
  let ordersCollection;
  let testOrderId;

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
        ordersCollection = db.collection('orders');
        done();
      } catch (e) {
        done(e);
      }
    });
  }, 35000);

  afterAll(async () => {
    if (db && ordersCollection) {
      try {
        await database.getDatabase().close();
      } catch (e) {
        console.error('Error closing database:', e);
      }
    }
  });

  describe('GET /orders - getAll', () => {
    test('should return all orders with 200 status', async () => {
      const req = { session: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ordersController.getAll(req, res);

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

      await ordersController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];

      // If there are orders, verify structure
      if (responseData.length > 0) {
        expect(responseData[0]).toHaveProperty('_id');
      }
    });
  });

  describe('GET /orders/:id - getSingle', () => {
    beforeAll(async () => {
      // Insert a test order
      const testOrder = {
        customerId: '507f1f77bcf86cd799439011',
        items: [
          {
            productId: '507f1f77bcf86cd799439012',
            quantity: 1,
            price: '$29.99',
          },
        ],
        totalAmount: '$29.99',
        status: 'pending',
        orderDate: new Date(),
      };
      const result = await ordersCollection.insertOne(testOrder);
      testOrderId = result.insertedId;
    });

    afterAll(async () => {
      // Clean up test order
      if (testOrderId) {
        await ordersCollection.deleteOne({ _id: testOrderId });
      }
    });

    test('should return a single order with 200 status', async () => {
      const req = {
        objectId: testOrderId,
        session: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ordersController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData._id.toString()).toBe(testOrderId.toString());
      expect(responseData.status).toBe('pending');
    });

    test('should return 404 when order not found', async () => {
      const fakeId = new ObjectId();
      const req = {
        objectId: fakeId,
        session: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ordersController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'orders record not found.',
      });
    });
  });
});
