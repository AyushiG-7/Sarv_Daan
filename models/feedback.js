const mon = require("mongoose");

const feedbackSchema = new mon.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  date: { type: String },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  medium: { type: String, required: true },
  comment: { type: String, required: true }
});

module.exports = mon.model("Feedback", feedbackSchema);
