import { ObjectId } from 'mongodb';
import {
  deletePeliculaStorage,
  getCountPeliculasStorage,
  getPeliculasStorage,
  getPeliculaStorage,
  InsertPeliculaStorage,
  updatePeliculaStorage,
} from '..';
import { NewPelicula } from '../../../model/pelicula';
import { closeDatabase } from '../../../util';

const data: NewPelicula = {
  title: 'Inquietante de netflix',
  slug: 'Es una de mis favoritas',
  image:
    'https://occ-0-3225-3933.1.nflxso.net/dnm/api/v6/X194eJsgWBDE2aQbaNdmCXGUP-Y/AAAABTcWmzuGa1YK6HExY-cSAcAHwEylrTtMiUNFM0wFx11rUPKhJiIjAE30RAVopCaASmViRAkx8_Ac1nU635NsGXnMV8MIjv24WmV0GiQ1Qw3Z88N7Q-oD_3IxGKMi.jpg?r=9d3',
  director: 'George Clooney',
  platforms: [],
  score: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('TEST STORAGE PELICULA', () => {
  afterAll(closeDatabase);

  test('crear pelicula', async () => {
    const res = await InsertPeliculaStorage(data);

    expect(res).toBeTruthy();
    expect(res).not.toBeNull();
  });

  test('obtener peliculas', async () => {
    const res = await getPeliculasStorage({ start: 0, limit: 20, findPelicula: 'Inquietante' });

    expect(res.length).toBeGreaterThan(0);
    expect(res).not.toBeNull();
  });

  test('Count paginacion pelicula', async () => {
    const res = await getCountPeliculasStorage({
      findPelicula: 'Inquietante',
    });

    expect(res).toEqual(1);
    expect(res).not.toBeNull();
  });

  test('Obtener pelicula', async () => {
    const resPeli = await getPeliculaStorage({
      title: data.title,
    });

    expect(resPeli.title).toEqual(data.title);
    expect(resPeli).not.toBeNull();
  });

  test('Actualizar pelicula', async () => {
    const resPeli = await getPeliculaStorage({
      title: data.title,
    });

    const res = await updatePeliculaStorage({
      _id: new ObjectId(resPeli._id),
      data: { title: data.title },
    });

    expect(res).toBeTruthy();
    expect(res).not.toBeNull();
  });

  test('Eliminar pelicula', async () => {
    const resPeli = await getPeliculaStorage({
      title: data.title,
    });

    const res = await deletePeliculaStorage({
      _id: new ObjectId(resPeli._id),
    });

    expect(res).toBeTruthy();
    expect(res).not.toBeNull();
  });
});
