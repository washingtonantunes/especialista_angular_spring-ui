import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Page } from '../core/model/page';
import { Pessoa } from '../core/model/pessoa';
import { environment } from 'src/environments/environment';

export class PessoaFiltro {
  nome?: string;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  pessoasUrl: string;

  constructor(private http: HttpClient) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<Page<Pessoa>> {
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return firstValueFrom(
      this.http.get<Page<Pessoa>>(this.pessoasUrl, { params })
    );
    /*return this.http
      .get(this.pessoasUrl, { headers, params })
      .toPromise()
      .then((response: any) => {
        const pessoas = response['content'];

        const resultado = {
          pessoas,
          total: response['totalElements'],
        };
        return resultado;
      });*/
  }

  listarTodas(): Promise<Pessoa[]> {
    return this.http
      .get(this.pessoasUrl)
      .toPromise()
      .then((response: any) => response['content']);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete<void>(`${this.pessoasUrl}/${codigo}`).toPromise();
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    return this.http
      .put<void>(`${this.pessoasUrl}/${codigo}/ativo`, ativo)
      .toPromise();
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return firstValueFrom(this.http.post<Pessoa>(this.pessoasUrl, pessoa));
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return firstValueFrom(
      this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
    );
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return firstValueFrom(
      this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
    );
  }
}
