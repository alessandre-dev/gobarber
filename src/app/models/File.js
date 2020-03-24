/*
  Model File (tabela Files)
  Manipulação dos arquivos
  Criar, alterar, excluir os dados...
*/

// Importação do Model do sequelize
// Importação do Sequelize para conseguir definir os tipos de campos
import Sequelize, { Model } from 'sequelize';

// Classe File será uma extensão da classe pai Model
class File extends Model {
  // Método estatico que será chamado automaticamente pelo Sequelize
  static init(sequelize) {
    // Chamando método init da classe pai Model
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        // 2º parâmetro do método (objeto sequelize)
        sequelize,
      }
    );

    return this;
  }
}

// Exportar a classe File
export default File;
