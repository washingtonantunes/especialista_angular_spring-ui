import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Page } from '../core/model/page';
import { Pessoa } from '../core/model/pessoa';

export class PessoaFiltro {
  nome?: string;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) {}

  pesquisar(filtro: PessoaFiltro): Promise<Page<Pessoa>> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return firstValueFrom(
      this.http.get<Page<Pessoa>>(this.pessoasUrl, { headers, params })
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
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    return this.http
      .get(this.pessoasUrl, { headers })
      .toPromise()
      .then((response: any) => response['content']);
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    return this.http
      .delete<void>(`${this.pessoasUrl}/${codigo}`, { headers })
      .toPromise();
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    return this.http
      .put<void>(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise();
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    return firstValueFrom(
      this.http.post<Pessoa>(this.pessoasUrl, pessoa, { headers })
    );
  }
}
