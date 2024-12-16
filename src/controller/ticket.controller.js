const ticketModel = require("../models/ticket.model");

class TicketController {
  getAllTickets = async (req, res) => {
    try {
      const tickets = await ticketModel.find({});
      if (!tickets || tickets.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Tickets no encontrados" });
      }
      res.status(200).json({
        status: true,
        message: "Tickets encontrados",
        tickets: tickets,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los tickets",
        error: err.message,
      });
    }
  };

  getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        return res
          .status(404)
          .json({ status: false, message: "Tickets no encontrados" });
      }
      res.render("ticket", { ticket });

    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener el ticket",
        error: err.message,
      });
    }
  };

  deleteTicket = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findByIdAndDelete(id);
      if (!ticket) {
        return res
          .status(404)
          .json({ status: false, message: "Tickets no encontrados" });
      }
      res
        .status(201)
        .json({ status: true, message: "Ticket eliminado", ticket: ticket });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar el ticket",
        error: err.message,
      });
    }
  };

  confirmStatusTicket = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      ticket.status = "confirmado";
      await ticket.save();
      res.status(200).json({
        status: true,
        message: "Ticket Confirmado con exito",
        ticket: ticket,
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  };

  cancelledStatusTicket = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      ticket.status = "cancelado";
      await ticket.save();
      res.status(200).json({
        status: true,
        message: "Ticket Cancelado con exito",
        ticket: ticket,
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  };
}

module.exports = TicketController;
