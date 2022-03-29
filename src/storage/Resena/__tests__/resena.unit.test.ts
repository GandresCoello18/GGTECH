import { ObjectId } from 'mongodb';
import {
  CountTotalResenaByPeliculaStorage,
  DeleteesenaByPeliculaStorage,
  InsertRsenaStorage,
  SumaTotalResenaByPeliculaStorage,
} from '..';
import { NewResena } from '../../../model/Resena';
import { closeDatabase } from '../../../util';

const idMovie = new ObjectId();
const idPlatform = new ObjectId();

const data: NewResena = {
  movie: idMovie,
  platform: idPlatform,
  author: 'Andres coello',
  body: 'Comentario...',
  score: 2.4,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TEST STORAGE RESEÑA', () => {
  afterAll(closeDatabase);

  test('crear reseña', async () => {
    const res = await InsertRsenaStorage(data);

    expect(res).toEqual(true);
    expect(res).not.toBeNull();
  });

  test('ontener la suma de todas las reseña por pelicula', async () => {
    const res = await SumaTotalResenaByPeliculaStorage(new ObjectId(data.movie));

    expect(res[0]._id).toEqual(new ObjectId(idMovie));
    expect(res[0].total).toEqual(2.4);
    expect(res).not.toBeNull();
  });

  test('Contar las reseña por pelicula', async () => {
    const res = await CountTotalResenaByPeliculaStorage(new ObjectId(data.movie));

    expect(res).toEqual(1);
    expect(res).not.toBeNull();
  });

  test('eliminar reseña', async () => {
    const res = await DeleteesenaByPeliculaStorage(new ObjectId(data.movie));

    expect(res).toEqual(true);
    expect(res).not.toBeNull();
  });
});
