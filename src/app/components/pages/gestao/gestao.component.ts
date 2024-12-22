import { Component, AfterViewInit, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Overlay from 'ol/Overlay';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestao',
  templateUrl: './gestao.component.html',
  styleUrls: ['./gestao.component.css'],
  imports: [CommonModule],
})
export class GestaoComponent implements AfterViewInit, OnInit {
  funcionarios: any[] = [];
  pontos: any[] = [];
  id: number = 123; // Exemplo de id inicial

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    // Requisição para obter os funcionários
    this.httpClient.get('http://localhost:8095/api/funcionario/consultar')
      .subscribe({
        next: (data) => {
          this.funcionarios = data as any[];
        },
        error: (err) => {
          console.error('Erro ao carregar funcionários:', err);
        }
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const mockCoordinate = [-43.176593, -22.907537]; // Coordenadas mock para exemplo

    const operadorData = {
      nome: 'JAVEIROS DE PLANTÃO',
      coordenadas: mockCoordinate,
    };

    const marker = new Feature({
      geometry: new Point(fromLonLat(mockCoordinate)),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          scale: 0.1,
          src: 'https://media.discordapp.net/attachments/1318715011186823310/1320224282994937946/trabalhadores.png?ex=6768d22d&is=676780ad&hm=e80978f1a76ff92cb5263a273c8d14c61aa67bf8e50dcfdd8c20e784d72de93f&=&format=webp&quality=lossless&width=585&height=585',
        }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: 'mapa',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(mockCoordinate),
        zoom: 16,
      }),
    });

    // Criando o Overlay
    const overlayElement = document.getElementById('tooltip');
    if (overlayElement) {
      const overlay = new Overlay({
        element: overlayElement as HTMLElement,
        positioning: 'bottom-center',
        offset: [0, -10],
      });

      map.addOverlay(overlay);

      // Evento de clique no mapa
      map.on('click', (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const geometry = feature.getGeometry();
          if (geometry && geometry instanceof Point) {
            const coordenadas = geometry.getCoordinates();
            if (coordenadas) {
              overlay.setPosition(coordenadas);
              overlayElement.style.display = 'block'; // Exibe o tooltip
              overlayElement.innerHTML = ` 
                <strong>Nome:</strong> ${operadorData.nome} <br />
                <strong>Coordenadas:</strong> ${operadorData.coordenadas.join(', ')}
              `;
            }
          }
        });
      });
    }
  }

  // Função para carregar os pontos de um funcionário selecionado
  loadPontos(idFuncionario: number): void {  
    this.id = idFuncionario; // Atualiza o id do funcionário
    console.log('Carregando pontos para o funcionário com ID:', idFuncionario);

    // Requisição para obter os pontos do funcionário
    const startDate = '2024-12-01';
    const endDate = '2024-12-31';

    this.httpClient.get<any[]>(`http://localhost:8095/api/ponto/consultar/${idFuncionario}/${startDate}/${endDate}`)
      .subscribe({
        next: (data) => {
          console.log('Dados de pontos recebidos:', data);
          this.pontos = data; // Atribui os pontos à variável 'pontos'
          this.addPontosToMap(data); // Adiciona os pontos no mapa
        },
        error: (err) => {
          console.error('Erro ao carregar pontos:', err);
        }
      });
  }

  // Função para adicionar os pontos ao mapa
  private addPontosToMap(pontos: any[]): void {
    const vectorSource = new VectorSource();

    pontos.forEach((ponto) => {
      const point = new Feature({
        geometry: new Point(fromLonLat(ponto.coordenadas)), // As coordenadas precisam estar em formato [longitude, latitude]
      });

      point.setStyle(
        new Style({
          image: new Icon({
            scale: 0.1,
            src: 'https://media.discordapp.net/attachments/1318715011186823310/1320224282994937946/trabalhadores.png?ex=6768d22d&is=676780ad&hm=e80978f1a76ff92cb5263a273c8d14c61aa67bf8e50dcfdd8c20e784d72de93f&=&format=webp&quality=lossless&width=585&height=585',
          }),
        })
      );

      vectorSource.addFeature(point);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Atualiza o mapa com os novos pontos
    const map = new Map({
      target: 'mapa',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-43.176593, -22.907537]), // Defina o centro inicial do mapa
        zoom: 16,
      }),
    });
  }
}
