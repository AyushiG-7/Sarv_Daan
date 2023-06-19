const mon = require("mongoose");

const donateSchema = new mon.Schema({
  address1: { type: String, required: true },
  address2: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  pinCode: { type: Number, required: true },
  food: { type: String, required: true },
  timeFrom: { type: String, required: true },
  timeTo: { type: String, required: true },
  date: { type: String, required: true },
  medium: { type: String, required: true },
  photo: { data: Buffer, contentType: String },
});

module.exports = mon.model("Donate", donateSchema);
