import { ObjectId } from 'mongodb';
import { Pelicula } from '../model/pelicula';
import { Plataforma, TitlePlataformas } from '../model/Plataforma';
import { GetPlataformaStorage } from '../storage/Plataforma';
import { GetResenasByPeliculaStorage } from '../storage/Resena';

export type ResponseWarning = {
  error: boolean;
  status?: string;
  response?: ObjectId[];
};

export const PlatformsPelicula = async (options: {
  platforms: TitlePlataformas[];
}): Promise<ResponseWarning> => {
  const { platforms } = options;

  const typePlatforms = platforms.some(plat => typeof plat !== 'string');

  if (typePlatforms) {
    return { error: true, status: 'Formato invalido en datos de plataforma' };
  }

  const isValid = await Promise.all(
    platforms.map(async plataforma => {
      if (
        plataforma !== 'Hbo' &&
        plataforma !== 'Netflix' &&
        plataforma !== 'Primer Video' &&
        plataforma !== 'YouTube'
      ) {
        return null;
      }

      const getPlatform = await GetPlataformaStorage({ title: plataforma });

      return getPlatform;
    }),
  );

  if (isValid.some(plat => plat === null || plat === undefined)) {
    return { error: true, status: 'Plataforma no valida, revise y vuelva ha intentarlo' };
  }

  const fixValid: Plataforma[] = isValid.filter(
    plat => plat !== null || plat !== undefined,
  ) as Plataforma[];

  return { error: false, response: fixValid.map(valid => valid?._id) as ObjectId[] };
};

export const SchemaPelicula = async (options: { getPeliculas: Pelicula[] }) => {
  return await Promise.all(
    options.getPeliculas.map(async peli => {
      const plataforsIdObjects = peli.platforms as ObjectId[];

      const platforms = await Promise.all(
        plataforsIdObjects.map(async plat => {
          const dataPlatform = await GetPlataformaStorage({ _id: new ObjectId(plat) });

          return {
            ...dataPlatform,
          };
        }),
      );

      return {
        ...peli,
        platforms,
      };
    }),
  );
};

export const SchemaResenasPelicula = async (options: { schemaPelicula: Pelicula[] }) => {
  return await Promise.all(
    options.schemaPelicula.map(async peli => {
      const plataformas = peli.platforms as Plataforma[];

      const reviews = await Promise.all(
        plataformas.map(async (platf: Plataforma) => {
          const resenaByPeli = await GetResenasByPeliculaStorage({
            idPelicula: peli._id,
            idPlataforma: platf._id,
          });

          return {
            [platf.title]: [...resenaByPeli],
          };
        }),
      );

      return {
        ...peli,
        reviews: reviews.filter(review => review !== undefined),
      };
    }),
  );
};
