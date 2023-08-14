import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  pessoaForm!: FormGroup;
  contatoForm!: FormGroup;

  contatoIndex!: number;

  editandoContato = false;

  exibindoFormularioContato = false;

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
    this.configurarPessoaForm();

    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Pessoa');

    if (codigoPessoa && codigoPessoa !== 'novo') {
      this.carregarPessoa(codigoPessoa);
    }
  }

  configurarPessoaForm() {
    this.pessoaForm = this.formBuilder.group({
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
      contatos: this.formBuilder.array([]),
    });
  }

  get editando() {
    return Boolean(this.pessoaForm.get('codigo')?.value);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService
      .buscarPorCodigo(codigo)
      .then((pessoa) => {
        this.pessoaForm.patchValue(pessoa);

        const contatosFormArray = this.pessoaForm.get('contatos') as FormArray;

        pessoa.contatos.forEach((contato) => {
          contatosFormArray.push(this.formBuilder.group(contato));
        });

        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  prepararNovoContato() {
    this.editandoContato = false;
    this.exibindoFormularioContato = true;
    this.configurarContatoForm();
  }

  prepararEdicaoContato(index: number) {
    this.configurarContatoForm();
    this.contatoIndex = index; // Armazena o índice do contato que está sendo editado

    const contatosFormArray = this.pessoaForm.get('contatos') as FormArray;
    const contatoFormGroup = contatosFormArray.at(index) as FormGroup;

    // Definir os valores do formulário de contato para edição
    this.contatoForm.patchValue(contatoFormGroup.value);
    this.editandoContato = true;
    this.exibindoFormularioContato = true;
  }

  configurarContatoForm() {
    this.contatoForm = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
    });
  }

  confirmarContato() {
    const contatos = this.pessoaForm.get('contatos') as FormArray;

    if (this.contatoIndex !== undefined && this.contatoIndex >= 0) {
      contatos.controls[this.contatoIndex].patchValue(this.contatoForm.value);
    } else {
      contatos.push(this.contatoForm);
    }

    this.exibindoFormularioContato = false;
  }

  removerContato(index: number) {
    const contatos = this.pessoaForm.get('contatos') as FormArray;
    contatos.removeAt(index);
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
      .adicionar(this.pessoaForm.value)
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
      .atualizar(this.pessoaForm.value)
      .then((pessoa: Pessoa) => {
        this.pessoaForm.patchValue(pessoa);

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa alterada com sucesso!',
        });
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  novo() {
    this.pessoaForm.reset();
    this.pessoaForm.patchValue(new Pessoa());

    this.router.navigate(['pessoas/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(
      `Edição de pessoa: ${this.pessoaForm.get('nome')?.value}`
    );
  }
}
