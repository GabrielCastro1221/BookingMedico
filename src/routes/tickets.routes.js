const { Router } = require("express");
const TicketController = require("../controller/ticket.controller");

const router = Router();
const ticket = new TicketController();

router.get("/", ticket.getAllTickets);
router.get("/:id", ticket.getTicketById);
router.delete("/:id", ticket.deleteTicket);
router.put("/confirm/:id", ticket.confirmStatusTicket);
router.put("/cancelled/:id", ticket.cancelledStatusTicket);

module.exports = router;
