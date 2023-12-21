export default class Controllers {
  constructor(repository) {
    this.repository = repository;
  }
  getAll = async (req, res, next) => {
    try {
      const items = await this.repository.getAll();
      res.status(200).send(items);
    } catch (error) {
      next(error.message);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const item = await this.repository.getById(pid);
      if (!item)
        res.status(404).send({ method: "getById", error: "Item not found" });
      else res.status(200).send(item);
    } catch (error) {
      next(error.message);
    }
  };

  update = async (req, res, next) => {
    try {
      const { pid } = req.params;
      let item = await this.repository.getById(pid);
      if (!item)
        res.status(404).send({ method: "update", error: "Item not found!" });

      const itemUpdated = await this.repository.update(pid, req.body);
      res.status(200).send(itemUpdated);
    } catch (error) {
      next(error.message);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const item = await this.repository.getById(pid);
      if (!item) {
        res.status(404).send({ method: "delete", error: "Item not found!" });
      } else {
        await this.repository.delete(pid);
        res.status(200).send({ message: "Item deleted", deleted: item });
      }
    } catch (error) {
      next(error.message);
    }
  };
}
