import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  pieChartData: any;
  lineChartData: any;

  optionsPie = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any): any => {
            let label = context.label || '';
            let value = context.raw || 0;
            let formattedValue = this.decimalPipe.transform(
              value,
              '1.2-2',
              'pt_BR'
            );
            return `${label}: R$ ${formattedValue}`;
          },
        },
      },
    },
  };

  optionsLine = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any): any => {
            let label = context.dataset.label || '';
            let value = context.raw || 0;
            let formattedValue = this.decimalPipe.transform(
              value,
              '1.2-2',
              'pt_BR'
            );
            return `${label}: R$ ${formattedValue}`;
          },
          title: (context: any) => {
            return `Dia ${context[0].label}`;
          },
        },
      },
    },
  };

  constructor(
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.configurarGraficoPizza();
    this.configurarGraficoLinha();
  }

  configurarGraficoPizza() {
    this.dashboardService.lancamentosPorCategoria().then((dados) => {
      this.pieChartData = {
        labels: dados.map((dado: any) => dado.categoria.nome),
        datasets: [
          {
            data: dados.map((dado: any) => dado.total),
            backgroundColor: [
              '#FF9900',
              '#109618',
              '#990099',
              '#3B3EAC',
              '#0099C6',
              '#DD4477',
              '#3366CC',
              '#DC3912',
            ],
          },
        ],
      };
    });
  }

  configurarGraficoLinha() {
    this.dashboardService.lancamentosPorDia().then((dados) => {
      const diasDoMes = this.configurarDiasMes();

      const totaisReceitas = this.totaisPorCadaDiaMes(
        dados.filter((dado: any) => dado.tipo === 'RECEITA'),
        diasDoMes
      );

      const totaisdespesas = this.totaisPorCadaDiaMes(
        dados.filter((dado: any) => dado.tipo === 'DESPESA'),
        diasDoMes
      );
      this.lineChartData = {
        labels: diasDoMes,
        datasets: [
          {
            label: 'Receitas',
            data: totaisReceitas,
            borderColor: '#3366CC',
          },
          {
            label: 'Despesas',
            data: totaisdespesas,
            borderColor: '#D62B00',
          },
        ],
      };
    });
  }

  private configurarDiasMes() {
    const mesReferencia = new Date();
    mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    mesReferencia.setDate(0);
    const quantidade = mesReferencia.getDate();

    const dias: number[] = [];
    for (let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }

    return dias;
  }

  private totaisPorCadaDiaMes(dados: any, diasDoMes: any) {
    const totais: number[] = [];
    for (const dia of diasDoMes) {
      let total = 0;

      for (const dado of dados) {
        if (dado.dia.getDate() === dia) {
          total = dado.total;
          break;
        }
      }

      totais.push(total);
    }

    return totais;
  }
}
