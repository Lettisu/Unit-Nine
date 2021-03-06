'use strict';


const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

const authenticateUser = async (req, res, next) => {
    let message;
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    if (credentials) {
        //Find user with matching email address
        const user = await User.findOne({
            raw: true,
            where: {
                emailAddress: credentials.name,
            },
        });
        //If user matches email
        if (user) {

            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            //If password matches
            if (authenticated) {
                console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                if (req.originalUrl.includes('courses')) {
                    //If route has a courses endpoint, set request userId to matched user id
                    req.body.userId = user.id;
                } else if (req.originalUrl.includes('users')) {
                    //If route has a users endpoint, set request id to matched user id
                    req.body.id = user.id;
                }
            } else {
                //Otherwise the Authentication failed
                message = `Authentication failed for user: ${user.firstName} ${user.lastName}`;
            }
        } else {
            // No email matching the Authorization header
            message = `User not found for email address: ${credentials.name}`;
        }
    } else {
        //No user credentials/authorization header available
        message = 'Authorization header not found';
    }
    // Deny Access if there is anything stored in message
    if (message) {
        console.warn(message);
        const err = new Error('Access Denied');
        err.status = 401;
        next(err);
    } else {
        //User authenticated
        next();
    }
}


router.get('/', (req, res) => {
    Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }]


    }).then(courses => {
        res.json(courses)
    })
});


router.get('/:id', (req, res, next) => { // returns the course (including the user that owns the course) for the provided course ID
    Course.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createAt', 'updateAt'],
        },
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }]
    }).then((course) => {
        if (course) {
            res.status(200).json({
                course
            });
        } else {
            const err = new Error(`Could not find a course that matches the id: ${req.params.id}`);
            err.status = 400;
            next(err);
        }
    })
})

router.post('/', authenticateUser, async (req, res, next) => {
    try {
        if (req.body.title && req.body.description) {
            const createCourse = await Course.create(req.body);
            res.location(`/api/courses/${createCourse.id}`);
            res.status(201).end();
        } else {
            //const err = new Error('Error 400 - Missing Required Information');
            res.status(400).json({ Message: 'Error 400 - Missing Required Information'});
            //next(err); 
        }
    } catch (err) {
        console.log('Error 401 - Unauthorized Request');
        next(err);
    }
});

//Updates a course
router.put('/:id', authenticateUser, async (req, res, next) => {
    //let course = await Course.findByPk(req.params.id);


    try {
        let course = await Course.findByPk(req.params.id);
        if (course.userId === req.body.userId) {
            if (req.body.title && req.body.description) {
                course.title = req.body.title;
                course.description = req.body.description;
                course.estimatedTime = req.body.estimatedTime;
                course.materialsNeeded = req.body.materialsNeeded;
                course = await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(400).json({ Message: 'Error 400 - Missing Required Information'});
            }
        } else {
            res.status(403).json({ Message: 'Error 403 - Unauthorized Request' });
            //console.log('Error 403 - Unauthorized Request');
            //next(err);
        }
    } catch (err) {
        // const err = new Error(`Ooops! You don't have permission`);
        // err.status = 403;
        res.status('Error 500 - Internal Server Error');
        next(err);
    }

})
//Deletes courses
router.delete("/:id", authenticateUser, async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course.userId === req.body.userId) {
            await course.destroy();
            res.status(204).end();
        } else {
            const err = new Error(`Ooops! You don't have permission`);
            err.status = 403;
            next(err);
        }
    
    } catch (err) {
        res.status('Error 500 - Internal Server Error');
        next(err);
    }
})


module.exports = router;