import { ticketManager } from "../factory.js";

export default class TicketRepository {
  constructor() {
    this.dao = ticketManager;
  }

  async create(purchase) {
    try {
      if (purchase === undefined || Object.keys(purchase).length === 0) {
        return `The purchase is either empty or undefined`;
      }

      const finalTicket = await this.dao.create(purchase);

      return finalTicket;
    } catch (error) {
      console.log(error);
    }
  }
}
