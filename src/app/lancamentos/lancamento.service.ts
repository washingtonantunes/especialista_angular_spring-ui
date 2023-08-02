import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Page } from '../core/model/page';
import { Lancamento } from '../core/model/lancamento';

export class LancamentoFiltro {
  descricao?: string;
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root',
})
export class LancamentoService {
  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  pesquisar(filtro: LancamentoFiltro): Promise<Page<Lancamento>> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set(
        'dataVencimentoDe',
        this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!
      );
    }

    if (filtro.dataVencimentoFim) {
      params = params.set(
        'dataVencimentoAte',
        this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!
      );
    }

    return firstValueFrom(
      this.http.get<Page<Lancamento>>(`${this.lancamentosUrl}?resumo`, {
        headers,
        params,
      })
    );
    /*return this.http
      .get<Page<Lancamento>>(`${this.lancamentosUrl}?resumo`, {
        headers,
        params,
      })
      .toPromise()
      .then((response: any) => {
        const lancamentos = response['content'];

        const resultado = {
          lancamentos,
          total: response['totalElements'],
        };

        return resultado;
      });*/
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    return this.http
      .delete<void>(`${this.lancamentosUrl}/${codigo}`, { headers })
      .toPromise();
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5Ad3RpLmNvbTphZG1pbg=='
    );

    return firstValueFrom(
      this.http.post<Lancamento>(this.lancamentosUrl, lancamento, { headers })
    );
    /*return this.http
      .post<Lancamento>(this.lancamentosUrl, lancamento, { headers })
      .toPromise();*/
  }
}
