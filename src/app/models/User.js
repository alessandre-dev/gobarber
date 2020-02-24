/*
  Model User (tabela users)
  Manipulação dos usuários
  Criar, alterar, excluir os dados...
*/

// Importação do Model do sequelize
// Importação do Sequelize para conseguir definir os tipos de campos
import Sequelize, { Model } from 'sequelize';

// Importação do Bcrypt para criar o hash do password
import bcrypt from 'bcryptjs';

// Classe User será uma extensão da classe pai Model
class User extends Model {
  // Método estatico que será chamado automaticamente pelo Sequelize
  static init(sequelize) {
    // Chamando método init da classe pai Model
    super.init(
      // 1º parametro do método super.init (objeto contendo todas as colunas)
      // Evitar as colunas que são chave primária, chave estrangeira, created_at, update_at
      // Definir apenas os campos que serão inseridas pelo usuário
      // Informar apenas o tipo do campo
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // Campo virtual nunca vai existir no BD
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // 2º parâmetro do método (objeto sequelize)
        sequelize,
      }
    );
    // Hook são trechos/eventos executados automaticamente
    // beforeSave antes de salvar os dados
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Método estatico para relacionar o "avatar_id" da tabelas users
  // com o campo "id" da tabela files
  static associate(models) {
    // belongsTo > pertence a...
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // Método para verificar a senha
  checkPassword(password) {
    // Método compare do bcrypt para comparar duas senhas
    // Retorna true caso as senhas batem, senão retorna false
    return bcrypt.compare(password, this.password_hash);
  }
}

// Exportar a classe User
export default User;
