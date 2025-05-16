// models/EmailLog.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailLogSchema = new Schema({
  to: { type: String, required: true },                // Recipient email
  subject: { type: String, required: true },            // Email subject
  content: { type: String, required: true },            // Email content/body
  status: { type: String, enum: ["Sent", "Failed"], default: "Sent" }, // Email status
  errorMessage: { type: String, default: null },        // Error message if sending failed
  createdAt: { type: Date, default: Date.now },         // Date when email was sent
});

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

module.exports = EmailLog;