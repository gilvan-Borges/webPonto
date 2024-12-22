import { Component, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

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
    const map = new Map({
      target: 'mapa', // ID do elemento div onde o mapa será renderizado
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-46.6333, -23.5505]), // Coordenadas iniciais (ex: São Paulo, Brasil)
        zoom: 5, // Nível de zoom inicial
      }),
    });
  }
}
