const { ObjectId } = require('mongodb');
const database = require('../data/database');
const employeesController = require('../controllers/employees');

describe('Employees - GET Routes (Real Database)', () => {
  let db;
  let employeesCollection;
  let testEmployeeId;

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
        employeesCollection = db.collection('employees');
        done();
      } catch (e) {
        done(e);
      }
    });
  }, 35000);

  afterAll(async () => {
    if (db && employeesCollection) {
      try {
        await database.getDatabase().close();
      } catch (e) {
        console.error('Error closing database:', e);
      }
    }
  });

  describe('GET /employees - getAll', () => {
    test('should return all employees with 200 status', async () => {
      const req = { session: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeesController.getAll(req, res);

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

      await employeesController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];

      // If there are employees, verify structure
      if (responseData.length > 0) {
        expect(responseData[0]).toHaveProperty('_id');
      }
    });
  });

  describe('GET /employees/:id - getSingle', () => {
    beforeAll(async () => {
      // Insert a test employee
      const testEmployee = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'testemployee@example.com',
        storeNumber: '1',
        role: 'Staff',
      };
      const result = await employeesCollection.insertOne(testEmployee);
      testEmployeeId = result.insertedId;
    });

    afterAll(async () => {
      // Clean up test employee
      if (testEmployeeId) {
        await employeesCollection.deleteOne({ _id: testEmployeeId });
      }
    });

    test('should return a single employee with 200 status', async () => {
      const req = {
        objectId: testEmployeeId,
        session: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeesController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData._id.toString()).toBe(testEmployeeId.toString());
      expect(responseData.firstName).toBe('Test');
      expect(responseData.lastName).toBe('Employee');
      expect(responseData.role).toBe('Staff');
    });

    test('should return 404 when employee not found', async () => {
      const fakeId = new ObjectId();
      const req = {
        objectId: fakeId,
        session: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeesController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'employees record not found.',
      });
    });
  });
});
