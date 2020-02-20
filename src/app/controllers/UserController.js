// Feature de Criação/Registro de Usuários
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // Função assincrona Store para cadastrar usuário
  async store(req, res) {
    // Validações
    // req.body é objecto
    // shape para definir o formato do objeto
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verifica se já existe um usuário com o e-mail informado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // Se existir, retorna o erro
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Cria o usuário e retorna apenas os campos definidos
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // Função assincrona Update para atualizar o usuário
  async update(req, res) {
    // Validações
    // req.body é objecto
    // shape para definir o formato do objeto
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    // Buscar o usuário pela Primary Key (ID da requisição)
    const user = await User.findByPk(req.userId);

    // ! ==  >> !==
    // Se foi informado um email para ser alterado
    // E o email informado for diferente do cadastrado
    if (email && email !== user.email) {
      // Verifica se já existe um usuário com o e-mail informado
      const userExists = await User.findOne({ where: { email } });

      // Se existir, retorna o erro
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // Se foi informado a senha antiga
    // E se a senha antiga estiver correta
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
