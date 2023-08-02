import { Component } from '@angular/core';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import { LancamentoFiltro, LancamentoService } from '../lancamento.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css'],
})
export class LancamentosPesquisaComponent {
  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos: any[] = [];

  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService
  ) {}

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.lancamentoService
      .pesquisar(this.filtro)
      .then((resultado: any) => {
        this.lancamentos = resultado.content;
        this.totalRegistros = resultado.totalElements;
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent): void {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      },
    });
  }

  excluir(lancamento_: any): void {
    this.lancamentoService
      .excluir(lancamento_.codigo)
      .then(() => {
        this.pesquisar(this.filtro.pagina);

        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento excluído com sucesso!',
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
