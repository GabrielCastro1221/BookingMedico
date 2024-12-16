const { Schema, model } = require("mongoose");

const schema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: "doctors", required: true },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  appointment_date: { type: Date, required: true },
  is_paid: { type: Boolean, default: false },
  ticket_price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["presencial", "online"],
    default: "presencial",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
});

module.exports = model("bookings", schema);
