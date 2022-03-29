import LoggerColor from 'node-color-log';
import PlataformaJson from '../mock/TypePlatforms.json';
import { NewPlataforma } from '../model/Plataforma';
import { GetPlataformaStorage, InsertPlataformaStorage } from '../storage/Plataforma';

const InsertPlataformas = async () => {
  try {
    await Promise.all(
      PlataformaJson.map(async (item: NewPlataforma) => {
        const getPlatf = await GetPlataformaStorage({ title: item.title });

        console.log(getPlatf);

        if (!getPlatf) {
          const data: NewPlataforma = {
            icon: item.icon,
            title: item.title,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await InsertPlataformaStorage(data);
        }
      }),
    );

    LoggerColor.bold().info('SUCCESS 🙂 script insert plataforma');
  } catch (error) {
    LoggerColor.bold().error('ERROR 🐛 ' + error.message);
  }
};

InsertPlataformas();
