import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Pessoa } from 'src/app/core/model/pessoa';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css'],
})
export class PessoaCadastroComponent implements OnInit {
  pessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {}

  salvar(pessoaForm: NgForm) {
    this.pessoaService
      .adicionar(this.pessoa)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa adicionada com sucesso!',
        });

        pessoaForm.reset();
        this.pessoa = new Pessoa();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
