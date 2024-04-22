import { Injectable } from '@angular/core';
import * as joint from '@joint/plus';
import { StencilService } from './stencil.service';

@Injectable({
  providedIn: 'root',
})
export class InitialService {
  el: HTMLElement;

  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  snaplines: joint.ui.Snaplines;
  paperScroller: joint.ui.PaperScroller;
  commandManager: joint.dia.CommandManager;

  stencilService: StencilService;

  constructor(el: HTMLElement, stencilService: StencilService) {
    this.el = el;
    this.stencilService = stencilService;
  }

  startRappid() {
    this.initializePaper();
    this.initializeStencil();
  }

  initializePaper() {
    const graph = (this.graph = new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      }
    ));

    this.commandManager = new joint.dia.CommandManager({ graph: graph });

    const paper = (this.paper = new joint.dia.Paper({
      width: 500,
      height: 300,
      gridSize: 10,
      drawGrid: true,
      model: graph,

    }));
  }

  initializeStencil() {
    const { paperScroller, stencilService, snaplines } = this;
    stencilService.create(paperScroller, snaplines);

    this.renderPlugin('.stencil-container', stencilService.stencil);
    stencilService.setShapes();

    // stencilService.stencil.on(
    //   'element:drop',
    //   (elementView: joint.dia.ElementView) => {
    //     // this.selection.collection.reset([elementView.model]);
    //   }
    // );
  }

  renderPlugin(selector: string, plugin: any): void {
    this.el.querySelector(selector)!.appendChild(plugin.el);
    plugin.render();
  }
}
