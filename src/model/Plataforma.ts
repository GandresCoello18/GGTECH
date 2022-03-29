import { ObjectId } from 'mongodb';

export type TitlePlataformas = 'Netflix' | 'Hbo' | 'Primer Video' | 'YouTube';

export interface NewPlataforma {
  icon: string;
  title: TitlePlataformas;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Plataforma extends NewPlataforma {
  readonly _id: ObjectId;
}
