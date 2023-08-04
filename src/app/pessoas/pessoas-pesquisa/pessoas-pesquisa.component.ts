import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { PessoaFiltro, PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css'],
})
export class PessoasPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas: any[] = [];

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.pessoaService
      .pesquisar(this.filtro)
      .then((resultado: any) => {
        this.pessoas = resultado.content;
        this.totalRegistros = resultado.totalElements;
      })
      .catch((erro) => this.errorHandler.handle(erro));
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
