import { ObjectId } from 'mongodb';
import { Plataforma } from './Plataforma';
import { Resena } from './Resena';

export interface NewPelicula {
  title: string;
  slug: string;
  image: string;
  director: string;
  platforms: ObjectId[] | Plataforma[];
  score: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  reviews?: Resena[];
}

export interface Pelicula extends NewPelicula {
  readonly _id: ObjectId;
}
