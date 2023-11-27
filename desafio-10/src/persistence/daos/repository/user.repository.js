import { userManager } from "../factory.js";

export default class UserRepository {
  constructor() {
    this.dao = userManager;
  }
}
