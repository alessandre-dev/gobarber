/*
  Model Appointment (tabela appointments)
  Agendamento de Serviços
  Criar, alterar, excluir os dados...
*/

// Importação do Model do sequelize
// Importação do Sequelize para conseguir definir os tipos de campos
import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

// Classe File será uma extensão da classe pai Model
class Appointment extends Model {
  // Método estatico que será chamado automaticamente pelo Sequelize
  static init(sequelize) {
    // Chamando método init da classe pai Model
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
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

  // Relacionamento dos campos user_id e provider_id com a tabela de usuários
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

// Exportar a classe Appointment
export default Appointment;
