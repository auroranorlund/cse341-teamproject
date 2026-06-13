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
    body('firstName').trim().isString().notEmpty().withMessage('First name is required and must be a string.'),
    body('lastName').trim().isString().notEmpty().withMessage('Last name is required and must be a string.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('billingAddress').trim().isString().notEmpty().withMessage('Billing address is required and must be a string.'),
    body('billingCity').trim().isString().notEmpty().withMessage('Billing city is required and must be a string.'),
    body('billingState').trim().isString().notEmpty().withMessage('Billing state is required and must be a string.'),
    body('billingZip').isNumeric().withMessage('Billing zip must be a number.'),
    body('shippingAddress').trim().isString().notEmpty().withMessage('Shipping address is required and must be a string.'),
    body('shippingCity').trim().isString().notEmpty().withMessage('Shipping city is required and must be a string.'),
    body('shippingState').trim().isString().notEmpty().withMessage('Shipping state is required and must be a string.'),
    body('shippingZip').isNumeric().withMessage('Shipping zip must be a number.'),
];

const employeeRules = [
    body('firstName').trim().isString().notEmpty().withMessage('First name is required and must be a string.'),
    body('lastName').trim().isString().notEmpty().withMessage('Last name is required and must be a string.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('storeNumber').isNumeric().withMessage('Store number is required and must be a number.'),
    body('role').trim().isString().notEmpty().withMessage('Role is required and must be a string.'),
];

const productRules = [
    body('productName').trim().isString().notEmpty().withMessage('Product name is required and must be a string.'),
    body('price').isFloat({ min: 0 }).withMessage('Price is required and must be a number greater than 0.'),
    body('productDescription').trim().isString().notEmpty().withMessage('Description is required and must be a string.'),
];

const orderRules = [
    body('customerId').isMongoId().withMessage('Valid customer ID is required.'),
    body('products').isArray({ min: 1 }).withMessage('Products must be an array with at least one item.'),
    body('products.*').isMongoId().withMessage('Each product ID must be valid.'),
    body('orderDate').isISO8601().withMessage('Order date must be a valid date (YYYY-MM-DD format).'),
];

module.exports = {
    validateData,
    customerRules,
    employeeRules,
    productRules,
    orderRules,
    handleValidationErrors,
};