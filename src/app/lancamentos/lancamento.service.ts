import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Page } from '../core/model/page';
import { Lancamento } from '../core/model/lancamento';
import { environment } from 'src/environments/environment';

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
  lancamentosUrl: string;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  uploadHeaders() {
    return new HttpHeaders().append(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  pesquisar(filtro: LancamentoFiltro): Promise<Page<Lancamento>> {
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
        params,
      })
    );
  }

  excluir(codigo: number): Promise<void> {
    return this.http
      .delete<void>(`${this.lancamentosUrl}/${codigo}`)
      .toPromise();
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return firstValueFrom(
      this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
    );
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return firstValueFrom(
      this.http.put<Lancamento>(
        `${this.lancamentosUrl}/${lancamento.codigo}`,
        lancamento
      )
    ).then((response: any) => {
      this.converterStringsParaDatas([response]);

      return response;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return firstValueFrom(
      this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
    ).then((response: any) => {
      this.converterStringsParaDatas([response]);

      return response;
    });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(
        new Date(lancamento.dataVencimento!).getTime() + offset
      );

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(
          new Date(lancamento.dataPagamento).getTime() + offset
        );
      }
    }
  }
}
