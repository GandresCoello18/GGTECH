import express from 'express';

import {
  GetPeliculas,
  GetPelicula,
  NewPelicula,
  NewResenaPelicula,
  UpdatePelicula,
  DeletePelicula,
} from './controller';

const router = express.Router();
const baseURL = '/pelicula';

router.post(`${baseURL}`, NewPelicula);
router.post(`${baseURL}/resena`, NewResenaPelicula);
router.get(`${baseURL}`, GetPeliculas);
router.get(`${baseURL}/:idPelicula`, GetPelicula);
router.put(`${baseURL}/:idPelicula`, UpdatePelicula);
router.delete(`${baseURL}/:idPelicula`, DeletePelicula);

export default router;
