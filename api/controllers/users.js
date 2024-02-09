const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');


exports.login_user = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email }).exec()
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: 'User not found' });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    }, process.env.JWT_KEY, {
                        expiresIn: '1hr'
                    })
                    return res.status(200).json({
                        message: 'Auth successful',
                        token
                    })

                }
                return res.status(401).json({ message: 'User not found' });
            })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.signup_user = (req, res, next) => {
    const { name, email, password, status } = req.body;
    User.findOne({ email }).exec()
        .then((user) => {
            if (user) {
                return res.status(409).json({ message: 'User with this email already exists' });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User(
                            {
                                _id: new mongoose.Types.ObjectId(),
                                name,
                                email,
                                password: hash,
                                status
                            }
                        )
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created successfully'
                                })
                            })
                            .catch((err) => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }

        })
}

exports.get_all_users = (req, res, next) => {
    User.find()
        .select('_id name email status')
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                userList: users,
                message: "User fetched successfully"
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}