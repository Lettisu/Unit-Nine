'use strict';

const express = require('express');
const router = express.Router();
const {
    Sequelize,
    sequelize,
    models
} = require('../models');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator');

//This array is used to keep track of users resords as they are created
const users = [];

//Route that returns a list of users
//  router.get('/users', (req, res) => {
//      res.json(users);
//  })

router.get('/', (req, res) => {
    res.json({
        //      Users.findAll()
        //          .then(users => {
        //              res.render('index', {
        //                  users: users
        //              });
        //          })
        //          .catch(err => console.log(err))
        //  });
        message: 'Welcome to the users route',

    });
})
//Route that creates new user
router.post('/users', [
    check('firstName')
        .exists({
            checkNull: true,
            checkFalsey: true
        })
        .withMessage('Please provide a value for "first name"'),

    check('lastName')
        .exists({
            checkNull: true,
            checkFalsey: true
        })
        .withMessage('Please provide a value for "last name"'),

    check('emailAddress')
        .exists()
        .withMessage('Please provide a value for "emailAddress"')
        .isEmail()
        .withMessage('Please enter a valid email address'),

    check('password')
        .exists()
        .withMessage('Please provide a value for "password"')
], (req, res) => {

    // Get the validation result from the Request object.
    const errors = validationResult(req);
    //If there are validation errors
    if (!errors.isEmpty()) {
        //Use map() method to get a list of error messages
        const errorMessages = errors.array().map(error => error.msg);
        //Return the validation errors to the client
        res.status(400).json({
            errors: errorMessages
        });
    } else {
        //Encrypt password from request body and create new User
        req.body.password = bcryptsjs.hashSync(req.body.password);
        User.create(req.body)
            .then((user) => {
                if (user) {
                    res.status(201).location('/').end();
                } else {
                    next();
                }
            })
    }

})

//Add a middleware function that attempts to get the user credentials
const authenticateUser = (req, res, next) => {
    let message = null;
    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (credentials) {
        // Look for a user whose `username` matches the credentials `name` property.
        const user = users.find(u => u.username === credentials.name);

        if (user) {
            const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.username}`);

                // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({
            message: 'Access Denied'
        });
    } else {
        next();
    }
};

//Add the user to the 'users' array
router.post('/users', (req, res) => {
    //Get the user from the request body
    const user = req.body;
    //Add the user to the 'users'array
    users.push(user);
    //Set the status to 201 Created and end the response
    res.status(201).end();
})

 //Get All Courses by ID GET/api/courses/:id
 // router.get('/courses/:id', asyncHandler(async (req, res) => {
 //     CountQueuingStrategy.findOne({
 //             attributes: ['id', 'userId', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
 //             where: {
 //                 id: req.params.id
 //             }
 //         })
 //         .then((course) => {
 //             if (course) {
 //                 res.json({
 //                     course
 //                 });
 //             } else {
 //                 res.status(400).end();
 //             }
 //         })
 // }))


module.exports = router;