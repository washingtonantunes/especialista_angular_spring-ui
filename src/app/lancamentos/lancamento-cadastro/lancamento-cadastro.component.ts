import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { CategoriaService } from 'src/app/categorias/categoria.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Lancamento } from 'src/app/core/model/lancamento';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css'],
})
export class LancamentoCadastroComponent implements OnInit {
  categorias: any[] = [];
  pessoas: any[] = [];
  lancamento: Lancamento = new Lancamento();

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();
  }

  salvar(lancamentoForm: NgForm) {
    this.lancamentoService
      .adicionar(this.lancamento)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });

        lancamentoForm.reset();
        this.lancamento = new Lancamento();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService
      .listarTodas()
      .then((categorias) => {
        this.categorias = categorias.map((c: any) => ({
          label: c.nome,
          value: c.codigo,
        }));
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService
      .listarTodas()
      .then((pessoas) => {
        this.pessoas = pessoas.map((p: any) => ({
          label: p.nome,
          value: p.codigo,
        }));
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
