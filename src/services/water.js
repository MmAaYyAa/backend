import { WaterCollection } from '../db/models/water.js';

//creating a new record(volume,date and userId)

export const createWater = async (payload) => {
  console.log('data', payload);
  //return await WaterCollection.create(payload);
  let { amount, date, currentDailyNorm, userId } = payload;
  // console.log('Перед обработкой userId:', userId, 'Тип:', typeof userId);

  // // Преобразование userId в строку, если требуется
  // if (Buffer.isBuffer(userId)) {
  //   userId = userId.toString('hex');
  // } else if (typeof userId !== 'string') {
  //   userId = String(userId);
  // }
  // console.log('После обработки userId:', userId, 'Тип:', typeof userId);

  const water = await WaterCollection.create({
    amount,
    date: new Date(date),
    currentDailyNorm,
    userId,
  });

  //const { _id, owner, ...other } = water.toObject();
  //const data = { id: _id, ...other };
  return water; //data;
};

//get water consumption record(id record,userId)to check if there is such a record

export const getWaterById = async (waterId, userId) => {
  const water = await WaterCollection.findOne({
    _id: waterId,
    userId,
  });

  if (!water) return null;

  // const { _id, owner, ...other } = water.toObject();
  // const data = { id: _id, ...other };
  // return data;
  return water;
};

//update consumption record by id(waterId,userId,payload-new data for update-amount and date)

export const updateWaterById = async (
  waterId,
  userId,
  payload,
  options = {},
) => {
  const water = await getWaterById(waterId, userId);

  if (!water) return null;

  const {
    amount = water.amount,
    date = water.date,
    currentDailyNorm = water.currentDailyNorm,
  } = payload;

  const updatedWater = await WaterCollection.findOneAndUpdate(
    {
      _id: waterId,
      userId,
    },
    { amount, date, currentDailyNorm },
    {
      new: true,
      ...options,
    },
  );

  if (!updatedWater) return null;

  // const { _id, owner, ...other } = updatedWater.toObject();
  // const data = { id: _id, ...other };
  // return data;
  return updatedWater;
};

//delete consumption record by id(waterId,userId)

export const deleteWaterById = async (waterId, userId) => {
  const water = await WaterCollection.findOneAndDelete({
    _id: waterId,
    userId,
  });

  if (!water) return null;

  // const { _id, owner, ...other } = water.toObject();
  // const data = { id: _id, ...other };
  // return data;
  return water;
};

//get all records of water consumption per day

export const getWaterPerDay = async (userId, date) => {
  console.log('userId', userId);
  console.log('date', date);
  const startOfDay = new Date(`${date}T00:00:00Z`);
  const endOfDay = new Date(`${date}T23:59:59Z`);

  console.log('Start of Day:', startOfDay);
  console.log('End of Day:', endOfDay);

  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  }).lean();
  // const waterRecords = await WaterCollection.find({
  //   userId,
  //   $expr: {
  //     $and: [
  //       {
  //         $gte: [
  //           {
  //             $dateFromString: {
  //               dateString: '$date',
  //               format: '%Y-%m-%d %H:%M:%S.%L',
  //             },
  //           },
  //           startOfDay,
  //         ],
  //       },
  //       {
  //         $lte: [
  //           {
  //             $dateFromString: {
  //               dateString: '$date',
  //               format: '%Y-%m-%d %H:%M:%S.%L',
  //             },
  //           },
  //           endOfDay,
  //         ],
  //       },
  //     ],
  //   },
  // }).lean();
  console.log('waterRecords', waterRecords);
  const totalWater = waterRecords.reduce(
    (sum, record) => sum + record.amount,
    0,
  );
  //array of all records of a day

  const allRecords = waterRecords.map((record) => ({
    id: record._id,
    amount: record.amount,
    date: record.date,
    currentDailyNorm: record.currentDailyNorm,
  }));

  return { totalWater, allRecords };
};

//get water consumption per month

export const getWaterPerMonth = async (userId, date) => {
  console.log('date', date);
  const startOfMonth = new Date(`${date}-01T00:00:00.000Z`);
  console.log('Start of Month:', startOfMonth.toISOString());
  //startOfMonth.setUTCDate(1); // the first day of a month
  //startOfMonth.setUTCHours(0, 0, 0, 0); // beginning of the day

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1); // next month
  endOfMonth.setUTCDate(0); // the last day of a month
  endOfMonth.setUTCHours(23, 59, 59, 999); // the end of a day
  console.log('End of Month:', endOfMonth.toISOString());

  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startOfMonth, $lt: endOfMonth },
  }).lean();

  const totalWater = waterRecords.reduce(
    (sum, record) => sum + record.amount,
    0,
  );
  console.log('Total Water for the Month:', totalWater);
  return totalWater;
};
