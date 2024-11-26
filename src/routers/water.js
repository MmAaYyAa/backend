import { Router } from 'express';
import {
  createWaterController,
  getWaterByIdController,
  updateWaterController,
  deleteWaterController,
  getWaterPerDayController,
  getWaterPerMonthController,
} from '../controllers/water.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
//import { validateBody } from '../middlewares/validateBody.js';
//import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
//import { isValidId } from '../middlewares/isValidId.js';

const waterRouter = Router();

waterRouter.post(
  '/water',
  //validateBody(createWaterSchema),
  authMiddleware,
  ctrlWrapper(createWaterController),
);

waterRouter.get(
  '/water/:waterId', //isValidId,
  authMiddleware,
  ctrlWrapper(getWaterByIdController),
);

waterRouter.patch(
  '/water/:waterId',
  //isValidId,
  authMiddleware,
  //validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

waterRouter.delete(
  '/water/:waterId',
  authMiddleware,
  //isValidId,
  ctrlWrapper(deleteWaterController),
);

waterRouter.get(
  '/water/day/:date',
  authMiddleware,
  ctrlWrapper(getWaterPerDayController),
);

waterRouter.get(
  '/water/month/:date',
  authMiddleware,
  ctrlWrapper(getWaterPerMonthController),
);

export default waterRouter;
