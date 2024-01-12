import logger from "../config/logger.config.js";

export const loggersInfo = async (req, res, next) => {
  logger.info(
    `A new ${req.method} petition has been made in endpoint ${req.url}`
  );
  try {
    await next();
  } catch (error) {
    logger.error(error);
  }
};
