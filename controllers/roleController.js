const Role = require('../models/Role');

const createRole = async (req, res, next) => {
    try {
        const { value } = req.body;
        const newRole = new Role({ value });
        await newRole.save();
        res.status(201).json({
            data: newRole,
        })
    } catch (error) {
        next(error)
    }
}

const deleteRole = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;
        await Role.findByIdAndDelete(roleId);
        res.status(200).json({
            data: null,
            message: 'Role has been deleted'
        });
    } catch (error) {
        next(error)
    }

}

module.exports = { createRole, deleteRole }