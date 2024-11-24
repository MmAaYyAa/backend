import createHttpError from 'http-errors';
import {
  createWater,
  getWaterById,
  updateWaterById,
  deleteWaterById,
  getWaterPerDay,
  getWaterPerMonth,
} from '../services/water.js';

// Создание новой записи о потреблении воды
export const createWaterController = async (req, res) => {
  const data = {
    ...req.body,
    userId: req.user.id,
  };

  const water = await createWater(data);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a water record!',
    data: water,
  });
};

// Получение записи о потреблении воды по ID
export const getWaterByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const water = await getWaterById(id, userId);

  if (!water) {
    return next(createHttpError(404, 'Water record not found'));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found water record with ID: ${id}!`,
    data: water,
  });
};

// Обновление записи о потреблении воды
export const updateWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const data = { ...req.body };

  const updatedWater = await updateWaterById(id, userId, data);

  if (!updatedWater) {
    return next(createHttpError(404, 'Water record not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated the water record!',
    data: updatedWater,
  });
};

// Удаление записи о потреблении воды
export const deleteWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const deletedWater = await deleteWaterById(id, userId);

  if (!deletedWater) {
    return next(createHttpError(404, 'Water record not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted the water record!',
    data: deletedWater,
  });
};

// Получение записей о потреблении воды за день
export const getWaterPerDayController = async (req, res, next) => {
  const userId = req.user.id;
  const { date } = req.params;

  const result = await getWaterPerDay({ userId, date });

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved daily water records!',
    data: result,
    totalAmount: result.reduce((sum, record) => sum + record.amount, 0),
  });
};

// Получение записей о потреблении воды за месяц
export const getWaterPerMonthController = async (req, res, next) => {
  const userId = req.user.id;
  const { date } = req.params;

  const result = await getWaterPerMonth({ userId, date });

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved monthly water records!',
    data: result,
    length: result.length,
  });
};
