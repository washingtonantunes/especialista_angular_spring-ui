import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ConfirmationService, LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-pessoas-grid',
  templateUrl: './pessoas-grid.component.html',
  styleUrls: ['./pessoas-grid.component.css'],
})
export class PessoasGridComponent {
  @Input() pessoas: any[] = [];
  @Input() itensPorPagina: number = 0;
  @Input() totalRegistros: number = 0;
  @Output() lazyLoadEvent = new EventEmitter();
  @Output() excluirEvent = new EventEmitter();
  @Output() alternarStatusEvent = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) {}

  aoMudarPagina(event: LazyLoadEvent) {
    this.lazyLoadEvent.emit(event);
  }

  confirmarExclusao(lancamento: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluirEvent.emit(lancamento);
      },
    });
  }

  alternarStatus(pessoa: any) {
    this.alternarStatusEvent.emit(pessoa);
  }
}
