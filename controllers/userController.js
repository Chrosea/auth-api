const User = require('../models/User');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const { verifyToken, createToken } = require('../helper/auth');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const signUp = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, password: hashedPassword, role: role || "user" });
        const accessToken = await createToken(newUser._id);
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            data: newUser,
            accessToken
        });
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username });
        if (!user) return next(new Error('Username does not exist'));

        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))

        const accessToken = await createToken(user._id);
        await User.findByIdAndUpdate(user._id, { accessToken });
        res.status(200).json({
            data: { username: user.username, role: user.role },
            accessToken
        });
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}

const addRoleToUser = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;
        const role = await Role.findById(roleId);
        const user = await User.findById(userId);
        if (user.role.includes(role.value)) return next(new Error('Role already been assigned'))

        const updatedRoles = [...user.role, role.value]
        await User.findByIdAndUpdate(userId, { role: updatedRoles })
        res.status(200).json({
            data: { username: user.username, role: updatedRoles },
            message: 'role has been updated'
        });
    } catch (error) {
        next(error)
    }
}

const checkRoleOfUser = async (req, res, next) => {
    try {
        const { roleId } = req.params
        const { accessToken } = req.body;
        const userId = await verifyToken(accessToken);
        const user = await User.findById(userId);
        if (!user) return next(new Error('Invalid token for a user'))

        const role = await Role.findById(roleId);
        const belongsTo = user.role.includes(role.value) ? true : false;
        res.json({
            data: belongsTo,
        })
    } catch (error) {
        next(error)
    }
}

const getAllRolesUser = async (req, res, next) => {
    try {
        const { accessToken } = req.body;
        const userId = await verifyToken(accessToken);
        const user = await User.findById(userId);
        if (!user) return next(new Error('Invalid token for a user'))
        res.json({
            data: user.role,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signUp, login, deleteUser, addRoleToUser, checkRoleOfUser, getAllRolesUser, invalidateToken
}