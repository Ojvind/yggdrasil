export const batchWriters = async (keys, models) => {
  const writers = await models.Writer.find({
    _id: {
      $in: keys,
    },
  });

  return keys.map(key => writers.find(writer => writer.id == key));
};
