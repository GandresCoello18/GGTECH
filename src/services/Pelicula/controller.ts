/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { CountPagination } from '../../helpers/numbers';
import {
  PlatformsPelicula,
  ResponseWarning,
  SchemaPelicula,
  SchemaResenasPelicula,
} from '../../helpers/pelicula';
import { isUrl } from '../../helpers/url';
import { NewPelicula as NewPeliculaInterface } from '../../model/pelicula';
import { TitlePlataformas } from '../../model/Plataforma';
import { NewResena } from '../../model/Resena';
import {
  deletePeliculaStorage,
  getCountPeliculasStorage,
  getPeliculasStorage,
  getPeliculaStorage,
  InsertPeliculaStorage,
  updatePeliculaStorage,
} from '../../storage/Pelicula';
import { GetPlataformaStorage } from '../../storage/Plataforma';
import {
  CountTotalResenaByPeliculaStorage,
  InsertRsenaStorage,
  SumaTotalResenaByPeliculaStorage,
} from '../../storage/Resena';

export const NewPelicula = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Peliculas', serviceHandler: 'NewPelicula' });
  req.logger.info({ status: 'start' });

  try {
    const { title, slug, image, director } = req.body;

    const platforms = req.body.platforms as TitlePlataformas[];

    if (!title || !slug || !image || !director || !platforms.length) {
      const response = { status: 'Datos incompletos, revise y vuelva ha intentarlo' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (typeof platforms !== 'object') {
      const response = { status: 'Error, el campo plataforma tiene que ser enviado como array' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!isUrl(image)) {
      const response = { status: 'La dirección de la imagen es invalida' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const getPelicula = await getPeliculaStorage({ title });

    if (getPelicula) {
      const response = {
        status: `El titulo: ${title} ya esta ocupado, revise y vuelva ha intentarlo`,
      };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const responsePlatform = await PlatformsPelicula({ platforms });

    if (responsePlatform.error && responsePlatform.status) {
      req.logger.warn(responsePlatform.status);
      return res.status(400).json({ status: responsePlatform.status });
    }

    if (!responsePlatform.response?.length) {
      const response = {
        status: `No se encontro plataformas para asignar`,
      };
      req.logger.warn(response);
      return res.status(500).json(response);
    }

    const data: NewPeliculaInterface = {
      title,
      slug,
      image,
      director,
      platforms: responsePlatform.response,
      score: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await InsertPeliculaStorage(data);
    return res.status(201).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

export const GetPeliculas = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Peliculas', serviceHandler: 'GetPeliculas' });
  req.logger.info({ status: 'start' });

  try {
    const findPelicula = req.query.findPelicula as string;
    const page = req.query.page as string;

    let pages = 0;
    let start = 0;
    const limit = 10;

    if (Number(page) > 1) {
      start = Math.trunc((Number(page) - 1) * limit);
    }

    const count = await getCountPeliculasStorage({ findPelicula });
    pages = CountPagination({ pagination: count / limit });

    const getPeliculas = await getPeliculasStorage({ findPelicula, limit, start });

    const peliculas = await SchemaPelicula({ getPeliculas });

    return res.status(200).json({ peliculas, pages });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

export const GetPelicula = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Peliculas', serviceHandler: 'GetPelicula' });
  req.logger.info({ status: 'start' });

  try {
    const { idPelicula } = req.params;

    if (!idPelicula) {
      const response = { status: 'Id pelicula no encontrada' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!ObjectId.isValid(idPelicula)) {
      const response = { status: 'Id pelicula invalido' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const getPelicula = await getPeliculaStorage({ _id: new ObjectId(idPelicula) });

    if (!getPelicula) {
      const response = { status: 'No se encontro pelicula' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const schemaPelicula = await SchemaPelicula({ getPeliculas: [getPelicula] });
    const schemaResenasPeli = await SchemaResenasPelicula({ schemaPelicula });

    return res.status(200).json({ pelicula: schemaResenasPeli[0] });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

export const UpdatePelicula = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Peliculas', serviceHandler: 'UpdatePelicula' });
  req.logger.info({ status: 'start' });

  try {
    const { idPelicula } = req.params;
    const { title, slug, image, director } = req.body;
    const platforms = req.body.platforms as TitlePlataformas[] | undefined;
    let responsePlatform: ResponseWarning | undefined = undefined;

    if (typeof platforms !== 'undefined' && typeof platforms !== 'object') {
      const response = { status: 'Error, el campo plataforma tiene que ser enviado como array' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idPelicula) {
      const response = { status: 'Id pelicula no encontrada' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!ObjectId.isValid(idPelicula)) {
      const response = { status: 'Id pelicula invalido' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const getPelicula = await getPeliculaStorage({ _id: new ObjectId(idPelicula) });

    if (!getPelicula) {
      const response = { status: 'No se encontro pelicula para actualizar' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (platforms && platforms.length) {
      responsePlatform = await PlatformsPelicula({ platforms });

      if (responsePlatform.error && responsePlatform.status) {
        req.logger.warn({ status: responsePlatform.status });
        return res.status(400).json({ status: responsePlatform.status });
      }

      if (!responsePlatform.response?.length) {
        const response = {
          status: `No se encontro plataformas para asignar`,
        };
        req.logger.warn(response);
        return res.status(400).json(response);
      }
    }

    const data: any = {
      updatedAt: new Date(),
    };

    if (title) {
      data.title = title;
    }

    if (slug) {
      data.slug = slug;
    }

    if (image) {
      if (!isUrl(image)) {
        const response = { status: 'La dirección de la imagen es invalida' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      data.image = image;
    }

    if (director) {
      data.director = director;
    }

    if (platforms && platforms.length) {
      data.platforms = responsePlatform ? responsePlatform.response : [];
    }

    await updatePeliculaStorage({ _id: new ObjectId(idPelicula), data });

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

export const DeletePelicula = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Peliculas', serviceHandler: 'DeletePelicula' });
  req.logger.info({ status: 'start' });

  try {
    const { idPelicula } = req.params;

    if (!idPelicula) {
      const response = { status: 'Id pelicula no encontrada' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!ObjectId.isValid(idPelicula)) {
      const response = { status: 'Id pelicula invalido' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const getPelicula = await getPeliculaStorage({ _id: new ObjectId(idPelicula) });

    if (!getPelicula) {
      const response = { status: 'No se encontro pelicula para eliminar' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await deletePeliculaStorage({ _id: new ObjectId(idPelicula) });

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};

// Reseñas

export const NewResenaPelicula = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Peliculas', serviceHandler: 'NewResenaPelicula' });
  req.logger.info({ status: 'start' });

  try {
    const { movie, platform, author, body, score } = req.body;

    if (!movie || !platform || !author || !body || !score) {
      const response = { status: 'Datos incompletos, revise y vuelva ha intentarlo' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (Number(score) > 5 || Number(score) < 1) {
      const response = { status: 'Calificación no valida, la nota tiene que estar entre 1 y 5' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!ObjectId.isValid(movie)) {
      const response = { status: 'Id pelicula invalido' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!ObjectId.isValid(platform)) {
      const response = { status: 'Id plataforma invalido' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const getPelicula = await getPeliculaStorage({ _id: new ObjectId(movie) });

    if (!getPelicula) {
      const response = {
        status: 'La pelicula ha calificar no existe, revise y vuelva ha intentarlo',
      };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const getPlatfom = await GetPlataformaStorage({ _id: new ObjectId(platform) });

    if (!getPlatfom) {
      const response = {
        status: 'La plataforma no existe, revise y vuelva ha intentarlo',
      };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const PlatformsObjectIds = getPelicula.platforms as ObjectId[];

    const PlatformsString: string[] = PlatformsObjectIds.map(plat =>
      new ObjectId(plat).toHexString(),
    );

    if (!PlatformsString.includes(new ObjectId(getPlatfom._id).toHexString())) {
      const response = {
        status: `La pelicula no cuenta en la plataforma ${getPlatfom.title}, revise y vuelva ha intentarlo`,
      };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const data: NewResena = {
      movie: new ObjectId(movie),
      platform: new ObjectId(platform),
      author,
      body,
      score,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await InsertRsenaStorage(data).then(async () => {
      // Calculo de promedio en reseñas
      const SumTotalResenas = await SumaTotalResenaByPeliculaStorage(movie);
      const CountTotalResenas = await CountTotalResenaByPeliculaStorage(movie);
      const score = (SumTotalResenas[0].total / CountTotalResenas).toFixed(2);

      await updatePeliculaStorage({
        _id: data.movie,
        data: { score },
      });
    });

    return res.status(201).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};
