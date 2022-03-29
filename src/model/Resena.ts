import { ObjectId } from 'mongodb';

export interface NewResena {
  movie: ObjectId;
  platform: ObjectId;
  author: string;
  body: string;
  score: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Resena {
  readonly _id: ObjectId;
}
