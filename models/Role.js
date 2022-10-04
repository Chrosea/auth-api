const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
    value: {
        type: String,
        default: 'user',
        unique: true 
    },
});

const Role = mongoose.model('roles', RoleSchema);
module.exports = Role;

