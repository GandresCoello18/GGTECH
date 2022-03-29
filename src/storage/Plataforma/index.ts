import { getLogger } from '../../middlewares';
import LoggerColor from 'node-color-log';
import { connectMongo } from '../../util';
import { NewPlataforma, Plataforma, TitlePlataformas } from '../../model/Plataforma';
import { ObjectId } from 'mongodb';

const PLATAFORMACOLLECTION = 'plataformas';

export const InsertPlataformaStorage = async (data: NewPlataforma) => {
  const logger = getLogger().child({ function: 'InsertPlataformaStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    await db.collection(PLATAFORMACOLLECTION).insertOne(data);

    return true;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const GetPlataformasStorage = async () => {
  const logger = getLogger().child({ function: 'GetPlataformasStorage' });
  logger.info({ status: 'start' });

  try {
    const db = await connectMongo();

    const data = db.collection(PLATAFORMACOLLECTION).find({}).sort({ createdAt: -1 });

    return (await data.toArray()) as Plataforma[];
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};

export const GetPlataformaStorage = async (options: {
  _id?: ObjectId;
  title?: TitlePlataformas;
}) => {
  const logger = getLogger().child({ function: 'GetPlataformaStorage' });
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

    const data = db.collection(PLATAFORMACOLLECTION).findOne(filter);

    return (await data) as Plataforma;
  } catch (error) {
    LoggerColor.bold().bgColor('red').error(error.message);
    logger.error({ status: 'error', error: error.message });
    throw error;
  }
};
