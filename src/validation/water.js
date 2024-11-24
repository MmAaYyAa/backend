import Joi from 'joi';

export const createWaterSchema = Joi.object({
  amount: Joi.number().integer().required().example(50).messages({
    'number.base': 'The amount of water should be a number.',
    'number.integer': 'The amount of water should be a whole number.',
    'any.required': 'The amount of water is mandatory for filling.',
  }),
  date: Joi.string().isoDate().required().messages({
    'string.base': 'The date must be a string.',
    'string.isoDate': 'The date must be in ISO date format.',
    'any.required': 'The date is required.',
  }),
  currentDailyNorm: Joi.number().required().messages({
    'number.base': 'The currentDailyNorm must be a number.',
    'any.required': 'The currentDailyNorm is required.',
  }),
  owner: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.base': 'The owner must be a string.',
      'string.pattern.base': 'The owner must be a valid ObjectId.',
    }),
});

export const updateWaterSchema = Joi.object({
  amount: Joi.number().integer().required().example(50).messages({
    'number.base': 'The amount of water should be a number.',
    'number.integer': 'The amount of water should be a whole number.',
    'any.required': 'The amount of water is mandatory for filling.',
  }),
  date: Joi.string().isoDate().required().messages({
    'string.base': 'The date must be a string.',
    'string.isoDate': 'The date must be in ISO date format.',
    'any.required': 'The date is required.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'You must specify at least one field to update.',
  });
