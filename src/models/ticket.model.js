const { Schema, model } = require("mongoose");

const schema = new Schema({
  code: { type: String, required: true },
  amount: { type: Number, required: true },
  appointment_date: { type: Date, required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "doctors", required: true },
  users: { type: Schema.Types.ObjectId, ref: "users", required: true },
  bookings: { type: Schema.Types.ObjectId, ref: "bookings", required: true },
  status: {
    type: String,
    enum: ["pendiente", "confirmado", "cancelado"],
    default: "pendiente",
  },
});

module.exports = model("tickets", schema);
