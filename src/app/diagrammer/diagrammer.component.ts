import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { toBPMN } from '@joint/format-bpmn-export';
import * as joint from '@joint/plus';
import { highlighters } from '@joint/plus';

import { saveAs } from 'file-saver';
import { DiagrammerService } from '../services/diagrammer.service';
import './helpers/shapes';
@Component({
  selector: 'app-diagrammer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagrammer.component.html',
  styleUrl: './diagrammer.component.css',
})
export default class DiagrammerComponent {
  public serviceDiagrammer = inject(DiagrammerService);
  public banderaShare = signal<boolean>(true);

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvasStencil') canvasStencil: ElementRef;

  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;

  private graphStencil: joint.dia.Graph;
  private paperStencil: joint.dia.Paper;
  paperHeight: number;
  paperWidth: number;
  public ngOnInit(): void {
    setTimeout(() => {
      this.banderaShare.set(false);
    }, 10000);
    const elementPaper = document.getElementById('canvasPrimary');
    const paperHeight = elementPaper!.clientHeight;
    const paperWidth = elementPaper!.clientWidth;
    this.paperHeight = paperHeight;
    this.paperWidth = paperWidth;
    const elementStencil = document.getElementById('stencilBase');
    const stencilHeight = elementStencil!.clientHeight;
    const stencilWidth = elementStencil!.clientWidth;
    const topY = 20;
    const graph = (this.graph = new joint.dia.Graph(
      {},
      { cellNamespace: joint.shapes }
    ));

    // OPERACIONES INTERACTIVAS DEL PAPER

    const restrictTranslate = (elementView: any) => {
      const element = elementView.model;
      const padding = element.isEmbedded() ? 20 : 10;
      return {
        x: padding,
        y: element.getBBox().y,
        width: paperWidth - 2 * padding,
        height: 0,
      };
    };

    const interactive = function (cellView: any) {
      const cell = cellView.model;
      return cell.isLink() ? { linkMove: false, labelMove: false } : true;
    };

    const defaultLink = (sourceView: any) => {
      const type = sourceView.model.get('type');
      switch (type) {
        case 'app.Message': {
          return new joint.shapes.app.LifeSpan();
        }
        case 'app.Lifeline': {
          return new joint.shapes.app.Message();
        }
      }
      throw new Error('Unknown link type.');
    };

    const connectionStrategy = (
      endDefinition: joint.dia.Link.EndJSON,
      endView: joint.dia.CellView,
      endMagnet: SVGElement,
      coords: joint.dia.Point,
      link: joint.dia.Link,
      endType: joint.dia.LinkEnd
    ) => {
      const type = link.get('type');
      switch (type) {
        case 'app.LifeSpan':
          if (endType === 'source') {
            endDefinition.anchor = {
              name: 'connectionRatio',
              args: { ratio: 1 },
            };
          } else {
            endDefinition.anchor = {
              name: 'connectionRatio',
              args: { ratio: 0 },
            };
          }
          return endDefinition;
        case 'app.Message':
          if (endType === 'source') {
            return joint.connectionStrategies.pinAbsolute.call(
              paper,
              endDefinition,
              endView,
              endMagnet,
              coords,
              link,
              endType
            );
          } else {
            endDefinition.anchor = { name: 'connectionPerpendicular' };
            return endDefinition;
          }
        default:
          throw new Error('Unknown link type.');
      }
    };

    const validateConnection = (
      cellViewS: any,
      magnetS: any,
      cellViewT: any,
      magnetT: any,
      end: any,
      linkView: any
    ) => {
      if (cellViewS === cellViewT) {
        return false;
      }
      const type = linkView.model.get('type');
      const targetType = cellViewT.model.get('type');
      switch (type) {
        case 'app.Message': {
          return targetType === 'app.Lifeline';
        }
        case 'app.LifeSpan': {
          if (targetType !== 'app.Message') {
            return false;
          }
          if (
            cellViewT.model instanceof joint.dia.Link &&
            cellViewS.model instanceof joint.dia.Link
          ) {
            if (cellViewT.model.source().id !== cellViewS.model.target().id)
              return false;
          }
          return true;
        }
        default: {
          return false;
        }
      }
    };

    // FUNCIONES CON RESPECTO A LOS EVENTOS QUE SE PUEDEN REALIZAR EN EL PAPER GRAPH

    const onEventAdd = (link: any) => {
      if (!link.isLink()) return;
      const type = link.get('type');
      switch (type) {
        case 'app.Lifeline': {
          const tools = new joint.dia.ToolsView({
            layer: null,
            tools: [
              new joint.linkTools.HoverConnect({
                scale: toolsScale,
              }),
            ],
          });
          link.findView(paper).addTools(tools);
          break;
        }
      }
    };

    const onEventLinkPointerMove = (
      linkView: any,
      _evt: any,
      _x: any,
      y: any
    ) => {
      const type = linkView.model.get('type');
      switch (type) {
        case 'app.Message': {
          const sView = linkView.sourceView;
          const tView = linkView.targetView;
          if (!sView || !tView) return;
          const padding = 20;
          const minY =
            Math.max(tView.sourcePoint.y - sView.sourcePoint.y, 0) + padding;
          const maxY = sView.targetPoint.y - sView.sourcePoint.y - padding;
          linkView.model.setStart(
            Math.min(Math.max(y - sView.sourcePoint.y, minY), maxY)
          );
          break;
        }
        case 'app.LifeSpan': {
          break;
        }
      }
    };

    const onEventLinkConnect = (linkView: any) => {
      const type = linkView.model.get('type');
      console.log(type);
      switch (type) {
        case 'app.Message': {
          this.editText(linkView, 'labels/0/attrs/labelText/text');
          break;
        }
        case 'app.LifeSpan': {
          break;
        }
      }
    };

    const onEventCellMouseEnter = (cellView: any) => {
      const cell = cellView.model;
      const type = cell.get('type');
      switch (type) {
        case 'app.Message': {
          const tools = new joint.dia.ToolsView({
            tools: [
              new joint.linkTools.Connect({
                scale: toolsScale,
                distance: -20,
              }),
              new joint.linkTools.Remove({
                scale: toolsScale,
                distance: 15,
              }),
            ],
          });
          cellView.addTools(tools);
          break;
        }
        case 'app.LifeSpan': {
          const tools = new joint.dia.ToolsView({
            tools: [
              new joint.linkTools.Remove({
                scale: toolsScale,
                distance: 15,
              }),
            ],
          });
          cellView.addTools(tools);
          break;
        }
        case 'app.Role': {
          const tools = new joint.dia.ToolsView({
            tools: [
              new joint.elementTools.Remove({
                scale: toolsScale,
                distance: '50%',
              }),
            ],
          });
          cellView.addTools(tools);
          break;
        }
      }
    };

    const onEventCellMouseLeave = (cellView: any) => {
      const cell = cellView.model;
      const type = cell.get('type');
      switch (type) {
        case 'app.Role':
        case 'app.LifeSpan':
        case 'app.Message': {
          cellView.removeTools();
          break;
        }
      }
    };

    const onEventBlackPointerdblclick = (evt: any, x: any, y: any) => {
      const role = new joint.shapes.app.Role({
        position: { x: x - 50, y: topY },
      });
      role.addTo(graph);
      const lifeline = new joint.shapes.app.Lifeline();
      lifeline.attachToRole(role, paperHeight);
      lifeline.addTo(graph);
      this.editText(role.findView(paper), 'attrs/label/text');
    };

    const onEventLinkPointerdblclick = (linkView: any, evt: any) => {
      const labelIndex = linkView.findAttribute('label-idx', evt.target);
      if (!labelIndex) return;
      this.editText(linkView, `labels/${labelIndex}/attrs/labelText/text`);
    };

    const onEventElementPointerdblclick = (elementView: any, evt: any) => {
      switch (elementView.model.get('type')) {
        case 'app.Role': {
          this.editText(elementView, 'attrs/label/text');
          break;
        }
        case 'app.RoleGroup': {
          this.editText(elementView, 'attrs/label/text');
          break;
        }
      }
    };

    const onEventRemove = (element: any) => {
      if (!element.isElement()) return;
      const embeds = backend.getEmbeddedCells();
      if (embeds.length < 2) {
        backend.unembed(embeds);
        backend.remove();
      }
    };

    const paper: any = (this.paper = new joint.dia.Paper({
      model: graph,
      height: elementPaper!.clientHeight,
      width: elementPaper!.clientWidth,
      background: {
        color: '#F8F9FA',
      },
      gridSize: 20,
      frozen: true,
      async: true,
      drawGrid: true,
      drawGridSize: 20,
      cellViewNamespace: joint.shapes,
      defaultConnectionPoint: { name: 'rectangle' },
      moveThreshold: 5,
      linkPinning: false,
      markAvailable: true,
      preventDefaultBlankAction: false,
      connector: { name: 'rounded' },
      restrictTranslate,
      interactive,
      defaultLink,
      connectionStrategy,
      validateConnection,
      highlighting: {
        connecting: {
          name: 'addClass',
          options: {
            className: 'highlighted-connecting',
          },
        },
      },
    }));

    const toolsScale = 2;
    graph.on('add', onEventAdd);
    graph.on('remove', onEventRemove);
    paper.on('link:connect', onEventLinkConnect);
    paper.on('cell:mouseenter', onEventCellMouseEnter);
    paper.on('cell:mouseleave', onEventCellMouseLeave);
    paper.on('link:pointermove', onEventLinkPointerMove);
    paper.on('link:pointerdblclick', onEventLinkPointerdblclick);
    paper.on('blank:pointerdblclick', onEventBlackPointerdblclick);

    // este necesito para hacer mis pruebas
    paper.on('element:pointerdblclick', onEventElementPointerdblclick);
    paper.on('element:pointerclick', (elementView: any, evt: any) => {
      const a = elementView.model.get('type');
      console.log(a);
    });

    paper.on('link:pointerup', () => {
      console.log('HOLA');
    });

    paper.on('element:pointerup', () => {
      console.log('blank:pointerup');
    });
    const backend = new joint.shapes.app.RoleGroup();
    backend.listenTo(graph, 'change:position', function (cell) {
      if (cell.isEmbeddedIn(backend)) backend.fitRoles();
    });

    const role2 = new joint.shapes.app.Role({ position: { x: 500, y: topY } });
    role2.setName('Web Server');
    role2.addTo(graph);

    const role3 = new joint.shapes.app.Role({ position: { x: 900, y: topY } });
    role3.setName('Database Server');
    role3.addTo(graph);

    const role1 = new joint.shapes.app.Role({ position: { x: 100, y: topY } });
    role1.setName('Browser');
    role1.addTo(graph);
    const lifeline1 = new joint.shapes.app.Lifeline();
    lifeline1.attachToRole(role1, paperHeight);
    lifeline1.addTo(graph);

    const lifeline2 = new joint.shapes.app.Lifeline();
    lifeline2.attachToRole(role2, paperHeight);
    lifeline2.addTo(graph);

    const lifeline3 = new joint.shapes.app.Lifeline();
    lifeline3.attachToRole(role3, paperHeight);
    lifeline3.addTo(graph);

    const message1 = new joint.shapes.app.Message();
    message1.setFromTo(lifeline1, lifeline2);
    message1.setStart(50);
    message1.setDescription('HTTP GET Request');
    message1.addTo(graph);

    const message2 = new joint.shapes.app.Message();
    message2.setFromTo(lifeline2, lifeline3);
    message2.setStart(150);
    message2.setDescription('SQL Command');
    message2.addTo(graph);

    const message3 = new joint.shapes.app.Message();
    message3.setFromTo(lifeline3, lifeline2);
    message3.setStart(250);
    message3.setDescription('Result Set');
    message3.addTo(graph);

    const lifespan1 = new joint.shapes.app.LifeSpan();
    lifespan1.attachToMessages(message2, message3);
    lifespan1.addTo(graph);

    paper.unfreeze();

    const graphStencil = (this.graphStencil = new joint.dia.Graph(
      {},
      { cellNamespace: joint.shapes }
    ));
    const paperStencil: any = (this.paperStencil = new joint.dia.Paper({
      model: graphStencil,
      height: stencilHeight,
      width: stencilWidth,
      background: {
        color: '#F8F9FA',
      },
      interactive: false,
      gridSize: 20,
      drawGrid: true,
      drawGridSize: 20,
      cellViewNamespace: joint.shapes,
      defaultConnectionPoint: { name: 'rectangle' },
    }));

    const roleExample = new joint.shapes.app.Role({
      position: { x: stencilWidth / 2 - 120, y: stencilHeight / 2 - 60 },
    });
    roleExample.setName('Elemento');
    roleExample.addTo(graphStencil);
    paperStencil.on('element:pointerdblclick', () => {
      const elemento1 = new joint.shapes.app.Role({
        position: { x: 10, y: topY },
      });
      elemento1.setName('Ejemplo');
      elemento1.addTo(graph);
      const lifeline1 = new joint.shapes.app.Lifeline();
      lifeline1.attachToRole(elemento1, paperHeight);
      lifeline1.addTo(graph);
    });
  }

  public ngAfterViewInit(): void {
    const { paper, canvas, paperStencil, canvasStencil } = this;
    canvas.nativeElement.appendChild(paper.el);
    canvasStencil.nativeElement.appendChild(paperStencil.el);
  }

  public onChangeViewFile(): void {
    this.serviceDiagrammer.onChangeviewActionsFile(true);
    this.serviceDiagrammer.onChangeviewActionsDev(false);
  }

  public onChangeViewDev(): void {
    this.serviceDiagrammer.onChangeviewActionsDev(true);
    this.serviceDiagrammer.onChangeviewActionsFile(false);
  }

  public onChangeViewShare(value: boolean): void {
    this.banderaShare.set(value);
  }

  capturarContent(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const extension = file.name.split('.').pop();

      if (extension !== 'xml') {
        console.error('Tipo de archivo no permitido');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlString = e.target!.result as string;
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'text/xml');

        // const importResult = fromBPMN(xml);

        // console.log(cells);
        // const json = xmljs.xml2json(xml, { compact: true, spaces: 4 });
        // this.graph.clear();
        // this.graph.fromJSON(json);
        // console.log(json);
      };

      reader.readAsText(file);
    }
  }

  exportarContent(): void {
    const exportResult = toBPMN(this.paper);
    console.log(exportResult);
    const exportResultString = JSON.stringify(exportResult);
    const blob = new Blob([exportResultString], { type: 'text/plain' });
    saveAs(blob, 'diagram.txt');
  }

  editText(cellView: any, textPath: any) {
    const cell = cellView.model;
    const textarea = document.createElement('textarea');
    textarea.style.position = 'absolute';
    textarea.style.width = '400px';
    textarea.style.height = '400px';
    textarea.style.left = '50%';
    if (typeof this.paper.options.height === 'number') {
      textarea.style.top = `${this.paper.options.height / 2}px`;
    }
    textarea.style.transform = 'translate(-50%, -50%)';
    textarea.style.padding = '5px';
    textarea.style.resize = 'none';
    textarea.style.fontSize = '100px';
    textarea.style.fontWeight = 'bold';
    textarea.style.boxShadow = '10px 10px 5px rgba(0, 0, 0, 0.5)';
    textarea.placeholder = cell.placeholder || 'Enter text here...';
    textarea.value = cell.prop(textPath) || '';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.setSelectionRange(0, textarea.value.length);

    cellView.paper.el.style.filter = 'blur(0.5px) grayscale(1)';
    cellView.paper.el.style.pointerEvents = 'none';

    const highlighter = highlighters.mask.add(cellView, 'root', 'selection', {
      layer: joint.dia.Paper.Layers.FRONT,
      deep: true,
    });

    function close() {
      textarea.remove();
      cellView.paper.el.style.filter = '';
      cellView.paper.el.style.pointerEvents = '';
      highlighter.remove();
    }

    function saveText() {
      cell.prop(textPath, textarea.value);
      close();
    }

    textarea.addEventListener('blur', saveText);

    textarea.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter' && !evt.shiftKey) {
        textarea.blur();
      }
      if (evt.key === 'Escape') {
        textarea.removeEventListener('blur', saveText);
        close();
      }
    });
  }
}
