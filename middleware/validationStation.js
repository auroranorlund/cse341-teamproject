const { ObjectId } = require('mongodb');

const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateData = (rules) => {
    return [
        ...rules,
        handleValidationErrors  
    ];
};

const customerRules = [
    body('firstName').isString().notEmpty().withMessage('First name is required and must be a string.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required.'),
];

const employeeRules = [
    body('firstName').isString().notEmpty().withMessage('First name is required and must be a string.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('position').isString().notEmpty().withMessage('Position is required and must be a string.'),
];

const productRules = [
    body('name').isString().notEmpty().withMessage('Product name is required and must be a string.'),
    body('price').isFloat({ min: 0 }).withMessage('Price is required and must be a number greater than 0.'),
    body('description').isString().notEmpty().withMessage('Description is required and must be a string.'),
];

const orderRules = [
    body('customerId').isMongoId().withMessage('Valid customer ID is required.'),
    body('productId').isMongoId().withMessage('Valid product ID is required.'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity is required and must be a positive integer.'),
];

module.exports = {
    validateData,
    customerRules,
    employeeRules,
    productRules,
    orderRules,
    handleValidationErrors,
};