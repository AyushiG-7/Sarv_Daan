const mon = require("mongoose");

const ngoSchema = new mon.Schema({
  medium: { type: String, required: true },
  name: { type: String, required: true },
  agent: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  pinCode: { type: Number, required: true }
});

module.exports = mon.model("NGO", ngoSchema);
