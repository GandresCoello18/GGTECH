import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './middlewares';

// Services
import Pelicula from './services/Pelicula';
import { config } from './util';

export const app = express();

const origin: (string | RegExp)[] = ['*'];

app.use(cors({ origin }));

app.use(helmet());
app.use(
  '/api',
  rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutos,
    max: 1500,
    message: 'Demasiadas solicitudes a partir de esta IP, inténtalo de nuevo después de 30 minutos',
  }),
);

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/static', express.static('public'));
app.set('port', config.PORT);

app.use((req, res, next) => express.json()(req, res, next));

app.use('/api', logger, [Pelicula]);

app.listen(app.get('port'), () => {
  console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
});
