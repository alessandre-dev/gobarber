// |> Configuração de upload de arquivos

// |> Biblioteca multer para realizar o upload
import multer from 'multer';
// |> Biblioteca crypto (padrão do Node)
import crypto from 'crypto';
// |> extname (extensão do arquivo)
//    resolve (percorrer caminho dentro da app)
import { extname, resolve } from 'path';

export default {
  // |> multer.diskStorage para guardar os arquivos dentro app
  storage: multer.diskStorage({
    // |> destino das imagens enviadas /tmp/uploads
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // |> filename > função para manipular o arquivo
    filename: (req, file, cb) => {
      // |> crypto irá gerar caracteres aleatorios (16 digitos)
      crypto.randomBytes(16, (err, res) => {
        // |> se der erro, irá retornar callback o erro
        if (err) return cb(err);
        // |> caso contrário retorna o nome do arquivo com a mesma
        //    extensão do arquivo original
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
