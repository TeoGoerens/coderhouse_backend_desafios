import MongoDao from "../mongo.dao.js";
import { ticketModel } from "../models/ticket.model.js";

export default class TicketManagerMongo extends MongoDao {
  constructor() {
    super(ticketModel);
  }
}
