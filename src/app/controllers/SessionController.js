// Feature de Sessão de Usuários
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Validações
    // req.body é objecto
    // shape para definir o formato do objeto
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    // Verifica se existe um usuário com o e-mail informado
    const user = await User.findOne({ where: { email } });

    // Caso não encontre, retorna o stutus 401 (sem autorização)
    if (!user) {
      return res.status(401).json({ erro: 'User not found' });
    }

    // Verifica se a senha é a mesma cadastrada
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ erro: 'Password does not match' });
    }

    // E-mail e senha autenticados...
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Método sign do jwt para gerar o token
      // 1º parâmetro (payload): informações adicionais para incorporar
      //    ao token (é um objeto) no caso o id do usuário
      // 2º parâmetro: uma string único em todas as aplicações
      //    acessar o md5online.org: digitar uma frase e utilizar o hash gerado
      // 3º parâmetro: configurações do token, como definir data expiração
      //    do token, por exemplo 7 dias expiresIn: '7d'
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expireIn,
      }),
    });
  }
}

export default new SessionController();
