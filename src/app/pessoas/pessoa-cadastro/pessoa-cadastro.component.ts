import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

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
  formulario!: FormGroup;

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configurarFormulario();

    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Pessoa');

    if (codigoPessoa && codigoPessoa !== 'novo') {
      this.carregarPessoa(codigoPessoa);
    }
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      endereco: this.formBuilder.group({
        logradouro: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [],
        bairro: [null, Validators.required],
        cep: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
      ativo: [true],
    });
  }

  get editando() {
    return Boolean(this.formulario.get('codigo')?.value);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService
      .buscarPorCodigo(codigo)
      .then((pessoa) => {
        this.formulario.patchValue(pessoa);
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarPessoa();
    } else {
      this.adicionarPessoa();
    }
  }

  adicionarPessoa() {
    this.pessoaService
      .adicionar(this.formulario.value)
      .then((pessoaAdicionada) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa adicionada com sucesso!',
        });

        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  atualizarPessoa() {
    this.pessoaService
      .atualizar(this.formulario.value)
      .then((pessoa: Pessoa) => {
        this.formulario.patchValue(pessoa);

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa alterada com sucesso!',
        });
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();
    this.formulario.patchValue(new Pessoa());

    this.router.navigate(['pessoas/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(
      `Edição de pessoa: ${this.formulario.get('nome')?.value}`
    );
  }
}
