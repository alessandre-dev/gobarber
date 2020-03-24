/**
 * Arquivo que processa a fila de jobs
 */

import 'dotenv/config';
import Queue from './lib/Queue';

Queue.processQueue();
