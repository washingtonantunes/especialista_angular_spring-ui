import { Pessoa } from './pessoa';

export class Lancamento {
  codigo?: number;
  tipo = 'RECEITA';
  descricao?: string;
  dataVencimento?: Date;
  dataPagamento?: Date;
  valor?: number;
  observacao?: string;
  pessoa = new Pessoa();
  categoria = new Categoria();
  anexo?: string;
  urlAnexo?: string;
}

export class Categoria {
  codigo?: number;
}
