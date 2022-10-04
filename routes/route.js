const express = require('express');
const { signUp, login, deleteUser, addRoleToUser, checkRoleOfUser, getAllRolesUser, invalidateToken } = require('../controllers/userController');
const { createRole, deleteRole } = require('../controllers/roleController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/invalidate-token', invalidateToken);
router.post('/user/assign/:userId/:roleId', addRoleToUser);
router.post('/user/role/:roleId', checkRoleOfUser);
router.post('/user/all-roles', getAllRolesUser);
router.delete('/user/:userId', deleteUser);

router.post('/role/create', createRole);
router.delete('/role/:roleId', deleteRole);
module.exports = router;
