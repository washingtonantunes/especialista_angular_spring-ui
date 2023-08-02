import { Component } from '@angular/core';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { PessoaFiltro, PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css'],
})
export class PessoasPesquisaComponent {
  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas: any[] = [];

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {}

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro).then((resultado: any) => {
      this.pessoas = resultado.pessoas;
      this.totalRegistros = resultado.total;
    });
  }

  mudarPagina(event: LazyLoadEvent): void {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  excluir(pessoa_: any): void {
    this.pessoaService
      .excluir(pessoa_.codigo)
      .then(() => {
        this.pesquisar(this.filtro.pagina);

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa excluída com sucesso!',
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService
      .mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({
          severity: 'success',
          detail: `Pesssoa ${acao} com sucesso!`,
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
