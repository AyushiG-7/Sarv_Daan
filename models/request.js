const mon = require("mongoose");

const requestSchema = new mon.Schema({
  address1: { type: String, required: true },
  address2: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  pinCode: { type: Number, required: true },
  number: { type: Number, required: true },
  user: {type: mon.Types.ObjectId, ref: "User", required: true}
  // user: {type: mon.Types.ObjectId, ref: "User", required: true}
  // user: { type: String, required: true }
});

module.exports = mon.model("Request", requestSchema);
