import { ObjectId } from 'mongodb';
import LoggerColor from 'node-color-log';
import { getLogger } from '../../middlewares';
import { NewResena, Resena } from '../../model/Resena';
import { connectMongo } from '../../util';

const RESENACOLLECTION = 'resenas';

export const InsertRsenaStorage = async (data: NewResena) => {
  const logger = getLogger().child({ function: 'InsertRsenaStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    await db.collection(RESENACOLLECTION).insertOne(data);

    return true;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const SumaTotalResenaByPeliculaStorage = async (_idPelicula: ObjectId) => {
  const logger = getLogger().child({ function: 'SumaTotalResenaStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    const data = db.collection(RESENACOLLECTION).aggregate([
      {
        $match: { movie: new ObjectId(_idPelicula) },
      },
      {
        $group: {
          _id: '$movie',
          total: { $sum: '$score' },
        },
      },
    ]);

    return (await data.toArray()) as { _id: ObjectId; total: number }[];
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const CountTotalResenaByPeliculaStorage = async (_idPelicula: ObjectId) => {
  const logger = getLogger().child({ function: 'SumaTotalResenaStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    const data = db
      .collection(RESENACOLLECTION)
      .find({ movie: new ObjectId(_idPelicula) })
      .count();

    return (await data) as number;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const GetResenasByPeliculaStorage = async (options: {
  idPelicula: ObjectId;
  idPlataforma: ObjectId;
}) => {
  const logger = getLogger().child({ function: 'GetResenasByPeliculaStorage' });
  logger.info({ status: 'start' });

  const { idPelicula, idPlataforma } = options;

  try {
    const db = await connectMongo();

    const data = db.collection(RESENACOLLECTION).find({
      $and: [{ movie: new ObjectId(idPelicula) }, { platform: new ObjectId(idPlataforma) }],
    });

    return (await data.toArray()) as Resena[];
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const DeleteesenaByPeliculaStorage = async (_idPelicula: ObjectId) => {
  const logger = getLogger().child({ function: 'SumaTotalResenaStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    db.collection(RESENACOLLECTION).deleteOne({ movie: new ObjectId(_idPelicula) });

    return true;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};
