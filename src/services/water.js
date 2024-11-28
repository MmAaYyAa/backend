import { WaterCollection } from '../db/models/water.js';

//creating a new record(volume,date and userId)
//date like Date(object)

// export const createWater = async (payload) => {
//   console.log('data', payload);
//   //return await WaterCollection.create(payload);
//   let { amount, date, currentDailyNorm, userId } = payload;
//   // console.log('Перед обработкой userId:', userId, 'Тип:', typeof userId);

//   // // Преобразование userId в строку, если требуется
//   // if (Buffer.isBuffer(userId)) {
//   //   userId = userId.toString('hex');
//   // } else if (typeof userId !== 'string') {
//   //   userId = String(userId);
//   // }
//   // console.log('После обработки userId:', userId, 'Тип:', typeof userId);

//   const water = await WaterCollection.create({
//     amount,
//     date: new Date(date),
//     currentDailyNorm,
//     userId,
//   });

  //const { _id, owner, ...other } = water.toObject();
  //const data = { id: _id, ...other };
 // return water; //data;
//};
export const createWater = async (payload) => {
  const { amount, date, currentDailyNorm, userId } = payload;

  const water = await WaterCollection.create({
    amount,
    date, // Сохраняем строку, как она передана
    currentDailyNorm,
    userId,
  });

  return water;
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

export const getWaterPerDay = async (userId, date) => {
  // convert the date string to Date object
  const dateObj = new Date(date);

  // get the start of the day (00:00:00)
  const startOfDay = new Date(dateObj);
  startOfDay.setUTCHours(0, 0, 0, 0);

  // get the end of the day (23:59:59.999)
  const endOfDay = new Date(dateObj);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Логируем start и end для проверки
  console.log('Start of Day ISO:', startOfDay.toISOString());
  console.log('End of Day ISO:', endOfDay.toISOString());

  // convert to ISO strings for filtering in  MongoDB
  const startOfDayISO = startOfDay.toISOString();
  const endOfDayISO = endOfDay.toISOString();

  // water records for the day
  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startOfDayISO, $lte: endOfDayISO },
  }).lean();


  if (!waterRecords || waterRecords.length === 0) {
    return {
      value: [],
      totalAmount: 0,
    };
  }


  const allRecords = waterRecords.map((record) => ({
    id: record._id,
    amount: record.amount,
    date: record.date,
    currentDailyNorm: record.currentDailyNorm,
  }));


  const totalAmount = waterRecords.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    allRecords,
    totalAmount,
  };
};
// export const getWaterPerDay = async (userId, dateString) => {
//   // Проверяем, передана ли дата
//   if (!dateString || typeof dateString !== 'string') {
//     throw new Error("Invalid date provided. Expected format: YYYY-MM-DD");
//   }

//   // Преобразуем строку формата YYYY-MM-DD в объект Date
//   const [year, month, day] = dateString.split('-').map(Number);

//   if (!year || !month || !day) {
//     throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
//   }

//   const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
//   const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

//   console.log('Start of Day:', startOfDay.toISOString());
//   console.log('End of Day:', endOfDay.toISOString());

//   // Ищем записи в диапазоне дат
//   const waterRecords = await WaterCollection.find({
//     userId,
//     date: {
//       $gte: startOfDay.toISOString(),
//       $lte: endOfDay.toISOString(),
//     },
//   }).lean();

//   if (!waterRecords || waterRecords.length === 0) {
//     return {
//       allRecords: [],
//       totalAmount: 0,
//     };
//   }

//   // Формируем массив записей
//   const allRecords = waterRecords.map((record) => ({
//     id: record._id,
//     amount: record.amount,
//     date: record.date,
//     currentDailyNorm: record.currentDailyNorm,
//   }));

//   // Подсчитываем общую сумму выпитой воды
//   const totalAmount = waterRecords.reduce((acc, curr) => acc + (curr.amount || 0), 0);

//   return {
//     allRecords,
//     totalAmount,
//   };
// };
// export const getWaterPerDay = async (userId, date) => {

//   const startOfDay = new Date(`${date}T00:00:00.000Z`).toISOString();
//   const endOfDay = new Date(`${date}T23:59:59.999Z`).toISOString();

//   console.log('Start of Day:', startOfDay);
//   console.log('End of Day:', endOfDay);

//   const waterRecords = await WaterCollection.find({
//     userId,
//     date: { $gte: startOfDay, $lte: endOfDay },
//   });

//   if (!waterRecords || waterRecords.length === 0) {
//     console.log('No water records found for the given day.');
//     return 0;
//   }

//   const totalWater = waterRecords.reduce((sum, record) => sum + record.amount, 0);

//   return totalWater;
// };

//get all records of water consumption per day
//date like Date(object)
// export const getWaterPerDay = async (userId, date) => {
//   console.log('userId', userId);
//   console.log('date', date);
//   const startOfDay = new Date(`${date}T00:00:00Z`);
//   const endOfDay = new Date(`${date}T23:59:59Z`);

//   console.log('Start of Day:', startOfDay);
//   console.log('End of Day:', endOfDay);

//   const waterRecords = await WaterCollection.find({
//     userId,
//     date: { $gte: startOfDay, $lte: endOfDay },
//   }).lean();
//   // const waterRecords = await WaterCollection.find({
//   //   userId,
//   //   $expr: {
//   //     $and: [
//   //       {
//   //         $gte: [
//   //           {
//   //             $dateFromString: {
//   //               dateString: '$date',
//   //               format: '%Y-%m-%d %H:%M:%S.%L',
//   //             },
//   //           },
//   //           startOfDay,
//   //         ],
//   //       },
//   //       {
//   //         $lte: [
//   //           {
//   //             $dateFromString: {
//   //               dateString: '$date',
//   //               format: '%Y-%m-%d %H:%M:%S.%L',
//   //             },
//   //           },
//   //           endOfDay,
//   //         ],
//   //       },
//   //     ],
//   //   },
//   // }).lean();
//   console.log('waterRecords', waterRecords);
//   const totalWater = waterRecords.reduce(
//     (sum, record) => sum + record.amount,
//     0,
//   );
//   //array of all records of a day

//   const allRecords = waterRecords.map((record) => ({
//     id: record._id,
//     amount: record.amount,
//     date: record.date,
//     currentDailyNorm: record.currentDailyNorm,
//   }));

//   return { totalWater, allRecords };
// };
export const getWaterPerMonth = async (userId, date) => {
  // Начало месяца
  const startOfMonth = new Date(`${date}-01T00:00:00.000Z`).toISOString();

  // Конец месяца
  const endOfMonth = new Date(`${date}-01T00:00:00.000Z`);
  endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1); // Переход на следующий месяц
  endOfMonth.setUTCDate(0); // Последний день предыдущего месяца
  endOfMonth.setUTCHours(23, 59, 59, 999); // Конец дня
  const endOfMonthISO = endOfMonth.toISOString();

  console.log('Start of Month:', startOfMonth);
  console.log('End of Month:', endOfMonthISO);

  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonthISO },
  });

  const totalWater = waterRecords.reduce((sum, record) => sum + record.amount, 0);

  return totalWater;
};
//get water consumption per month
//date like Date(object)
// export const getWaterPerMonth = async (userId, date) => {
//   console.log('date', date);
//   const startOfMonth = new Date(`${date}-01T00:00:00.000Z`);
//   console.log('Start of Month:', startOfMonth.toISOString());
//   //startOfMonth.setUTCDate(1); // the first day of a month
//   //startOfMonth.setUTCHours(0, 0, 0, 0); // beginning of the day

//   const endOfMonth = new Date(startOfMonth);
//   endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1); // next month
//   endOfMonth.setUTCDate(0); // the last day of a month
//   endOfMonth.setUTCHours(23, 59, 59, 999); // the end of a day
//   console.log('End of Month:', endOfMonth.toISOString());

//   const waterRecords = await WaterCollection.find({
//     userId,
//     date: { $gte: startOfMonth, $lt: endOfMonth },
//   }).lean();

//   const totalWater = waterRecords.reduce(
//     (sum, record) => sum + record.amount,
//     0,
//   );
//   console.log('Total Water for the Month:', totalWater);
//   return totalWater;
// };
