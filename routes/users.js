'use strict';

const express = require('express');
const router = express.Router();
const dbmodule = require('../db')
const models = dbmodule.models
// const bcryptjs = require('bcryptjs');
// const auth = require('basic-auth');

const { Courses, User } = models

router.get('/users', (req, res) => {
    User.findAll({

    }).then((user) => {
        res.json(user);
    });
});


// const authenticateUser = async (req, res, next) => {
//     let message;
//     const credentials = auth(req);
//     if (credentials) {
//         const user = await User.findOne({
//             raw: true,
//             where: {
//                 emailAddress: credentials.name,
//             },
//         });
//         if (user) {
//             const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
//             if (authenticated) {
//                 console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
//                 if (req.originalUrl.includes('users')) {
//                     req.body.id = user.id;
//                 } else {
//                     message = `Authentication failure for username: ${user.firstName} ${user.lastName}`;
//                 }
//             } else {
//                 message = `User not found for username: ${credentials.name}`;
//             }
//         } else {
//             message = 'Auth header not found';
//         }
//         if (message) {
//             console.warn(message);
//             res.status(401).json({ message: 'Access Denied' });
//         } else {
//             next();
//         }
//     };

//     router.get('/', authenticateUser, async (req, res) => {
//         const user = await User.findByPk(req.body.id,
//             {
//                 attributes: {
//                     exclude: ['password', 'createdAt', 'updatedAt'],
//                 },
//             }
//         );
//         res.json(user);
//     })
//     router.post('/', (req, res) => {
//         //const user = req.body
//         if (req.body.password) {
//             req.body.password = bcryptjs.hashSync(req.body.password);
//             User.create(req.body);
//             res.location('/');
//             res.status(201).end();

//         } else {
//             res.status(401).end();
//         }

//     })
// }
module.exports = router;