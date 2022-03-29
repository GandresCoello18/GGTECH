/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLogger } from '../../middlewares';
import { connectMongo } from '../../util';
import LoggerColor from 'node-color-log';
import { NewPelicula, Pelicula } from '../../model/pelicula';
import { ObjectId } from 'mongodb';

const PELICULASCOLLECTION = 'peliculas';

export const InsertPeliculaStorage = async (data: NewPelicula) => {
  const logger = getLogger().child({ function: 'InsertPeliculaStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    await db.collection(PELICULASCOLLECTION).insertOne(data);

    return true;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const getPeliculasStorage = async (options: {
  start?: number;
  limit?: number;
  findPelicula?: string;
}) => {
  const logger = getLogger().child({ function: 'getPeliculasStorage' });
  logger.info({ status: 'start' });

  const { start, limit, findPelicula } = options;

  let filter = {};

  if (findPelicula) {
    filter = {
      $or: [
        {
          title: new RegExp(findPelicula, 'i'),
        },
        {
          director: new RegExp(findPelicula, 'i'),
        },
        {
          slug: new RegExp(findPelicula, 'i'),
        },
      ],
    };
  }

  try {
    const db = await connectMongo();

    const cursor = db
      .collection(PELICULASCOLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(start || 0)
      .limit(limit || 20);

    return (await cursor.toArray()) as Pelicula[];
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const getCountPeliculasStorage = async (options: { findPelicula?: string }) => {
  const logger = getLogger().child({ function: 'getCountPeliculasStorage' });
  logger.info({ status: 'start' });

  const { findPelicula } = options;
  let filter = {};

  if (findPelicula) {
    filter = {
      $or: [
        {
          title: new RegExp(findPelicula, 'i'),
        },
        {
          director: new RegExp(findPelicula, 'i'),
        },
        {
          slug: new RegExp(findPelicula, 'i'),
        },
      ],
    };
  }

  try {
    const db = await connectMongo();

    const cursor = db.collection(PELICULASCOLLECTION).find(filter).sort({ createdAt: -1 });

    return (await cursor.count()) as number;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const getPeliculaStorage = async (options: { title?: string; _id?: ObjectId }) => {
  const logger = getLogger().child({ function: 'getPeliculaStorage' });
  logger.info({ status: 'start' });

  const { title, _id } = options;
  let filter = {};

  if (title) {
    filter = { title };
  }

  if (_id) {
    filter = { _id };
  }

  try {
    const db = await connectMongo();

    const cursor = db.collection(PELICULASCOLLECTION).findOne(filter);

    return (await cursor) as Pelicula;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const updatePeliculaStorage = async (options: { data: any; _id: ObjectId }) => {
  const logger = getLogger().child({ function: 'updatePeliculaStorage' });
  logger.info({ status: 'start' });

  const { data, _id } = options;

  try {
    const db = await connectMongo();

    db.collection(PELICULASCOLLECTION).updateOne(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: data,
      },
    );

    return true;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const deletePeliculaStorage = async (options: { _id: ObjectId }) => {
  const logger = getLogger().child({ function: 'deletePeliculaStorage' });
  logger.info({ status: 'start' });

  const { _id } = options;

  try {
    const db = await connectMongo();

    db.collection(PELICULASCOLLECTION).deleteOne({
      _id: new ObjectId(_id),
    });

    return true;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};
