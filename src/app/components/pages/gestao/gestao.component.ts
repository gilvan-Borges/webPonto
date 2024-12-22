import { Component, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-gestao',
  templateUrl: './gestao.component.html',
  styleUrls: ['./gestao.component.css']
})
export class GestaoComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Coordenadas em [longitude, latitude]
    const mockCoordinate = [-43.176593, -22.907537]; 

    // Criando a feature para a marcação
    const marker = new Feature({
      geometry: new Point(fromLonLat(mockCoordinate)),
    });

    // Estilo da marcação (usando o ícone do boneco)
    marker.setStyle(
      new Style({
        image: new Icon({
          scale: 0.1, // Ajusta o tamanho do ícone
          src: 'https://media.discordapp.net/attachments/1318715011186823310/1320224282994937946/trabalhadores.png?ex=6768d22d&is=676780ad&hm=e80978f1a76ff92cb5263a273c8d14c61aa67bf8e50dcfdd8c20e784d72de93f&=&format=webp&quality=lossless&width=585&height=585',
        }),
      })
    );

    // Fonte e camada de vetor para a marcação
    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Criando o mapa
    const map = new Map({
      target: 'mapa',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer, // Adicionando a camada de vetor ao mapa
      ],
      view: new View({
        center: fromLonLat(mockCoordinate),
        zoom: 16, // Ajusta o zoom para ver a marcação de perto
      }),
    });
  }
}
