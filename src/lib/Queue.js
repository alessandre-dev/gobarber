/**
 * Classe responsável por gerenciar a fila de jobs
 */

import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// vetor jobs deve constar todos os jobs da aplicação
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   * Método init - inicia a fila
   * Irá percorrer o vetor jobs (forEach)
   * - desestruturação para acessar os métodos da classe do job (key, handle)
   * - objeto queues (chave única do job) = 2 parâmetros
   *  - bee: inicia a fila e realiza conexão com o banco de dados redis
   *  - handle = método que processa o job
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Método add - adiciona o novo job a fila
   * - queue: qual fila será adicionado
   * - job: dados do job
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Método processQueue - processa a fila
   * Irá percorrer o vetor jobs (forEach)
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
