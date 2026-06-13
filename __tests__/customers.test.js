const { ObjectId } = require('mongodb');
const database = require('../data/database');
const customersController = require('../controllers/customers');

describe('Customers - GET Routes (Real Database)', () => {
  let db;
  let customersCollection;
  let testCustomerId;

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
        customersCollection = db.collection('customers');
        done();
      } catch (e) {
        done(e);
      }
    });
  }, 35000);

  afterAll(async () => {
    if (db && customersCollection) {
      try {
        await database.getDatabase().close();
      } catch (e) {
        console.error('Error closing database:', e);
      }
    }
  });

  describe('GET /customers - getAll', () => {
    test('should return all customers with 200 status', async () => {
      const req = { session: { user: {} } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await customersController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(Array.isArray(responseData)).toBe(true);
    });

    test('should return array of objects with expected fields', async () => {
      const req = { session: { user: {} } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await customersController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];

      // If there are customers, verify structure
      if (responseData.length > 0) {
        expect(responseData[0]).toHaveProperty('_id');
      }
    });
  });

  describe('GET /customers/:id - getSingle', () => {
    beforeAll(async () => {
      // Insert a test customer
      const testCustomer = {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        billingAddress: '123 Test St',
        billingCity: 'Test City',
        billingState: 'TS',
        billingZip: '12345',
        shippingAddress: '123 Test St',
        shippingCity: 'Test City',
        shippingState: 'TS',
        shippingZip: '12345',
      };
      const result = await customersCollection.insertOne(testCustomer);
      testCustomerId = result.insertedId;
    });

    afterAll(async () => {
      // Clean up test customer
      if (testCustomerId) {
        await customersCollection.deleteOne({ _id: testCustomerId });
      }
    });

    test('should return a single customer with 200 status', async () => {
      const req = {
        objectId: testCustomerId,
        session: { user: {} },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await customersController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData._id.toString()).toBe(testCustomerId.toString());
      expect(responseData.firstName).toBe('Test');
      expect(responseData.lastName).toBe('Customer');
    });

    test('should return 404 when customer not found', async () => {
      const fakeId = new ObjectId();
      const req = {
        objectId: fakeId,
        session: { user: {} },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await customersController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'customers record not found.',
      });
    });
  });
});
