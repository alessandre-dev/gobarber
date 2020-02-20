import jwt from 'jsonwebtoken';

// promisify da biblioteca util que é padrão no Node
// transforma uma função de callback para poder utilizar o async e await
import { promisify } from 'util';

// Necessário o segredo que está definido nas configurações de autenticação
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // caso o token não conste na requisição, informa o erro
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // split para dividir o token
  // pois consta Bearer token (espaço)
  const [, token] = authHeader.split(' ');

  try {
    // decoded é retornado pelo método verify
    // 1º parâmetro é o token
    // 2º parâmetro é o segredo utilizado para gerar o token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Incluir o ID do usuário (token) na requisição
    req.userId = decoded.id;

    // next() para continuar as demais rotas da API
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
