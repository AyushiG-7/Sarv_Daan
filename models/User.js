const mon = require("mongoose")

const userSchema = new mon.Schema({

    name: {type: String, required: true },
    contact: {type: String, required: true, unique:true },
    password: {type: String, required: true, minlength: 6 }
    // posts: [{type: mon.Types.ObjectId, ref:"Request"}]
})

module.exports = mon.model('User', userSchema)
