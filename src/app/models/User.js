const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoIncrement = require('mongoose-sequence')(mongoose);

const User = new Schema(
    {
        _id: { type: Number },
        name: { type: String, required: true },
        email: { type: String, required: true },
        admin: { type: Number, default: 0 },
        picture: {type: String }
    },
    {
        _id: false,
        timestamps: true,
    },
);

//Add plugins
User.plugin(AutoIncrement, { id: 'id_users' });

module.exports = mongoose.model('User', User);
