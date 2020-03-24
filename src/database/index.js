/*
  - Arquivo responsável por criar a conexão com o Banco de Dados
  - Carregar todos os Models da aplicação
*/

// Responsável pela conexão
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// Importa os Models da API
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// Importa as configurações de conexão com o BD
import databaseConfig from '../config/database';

// Inclusão de todos os models dentro um ARRAY
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    // Realiza a conexão com o BD
    this.connection = new Sequelize(databaseConfig);

    // Map para percorrer todos os Models do ARRAY
    // Chama o método init passando a conexão
    // Chama o método associate caso exista no model
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
