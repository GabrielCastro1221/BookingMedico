const { Router } = require("express");
const BookingController = require("../controller/booking.controller");

const router = Router();
const booking = new BookingController();

router.get("/", booking.getAllBookings);
router.get("/:id", booking.getBookingById);
router.delete("/:id", booking.deleteBooking);

module.exports = router;
