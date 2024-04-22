import { Injectable } from '@angular/core';
import { ui, dia } from '@joint/plus';

@Injectable({
  providedIn: 'root',
})
export class StencilService {
  stencil: ui.Stencil;

  create(paperScroller: ui.PaperScroller, snaplines: ui.Snaplines) {
    this.stencil = new ui.Stencil({
      paper: paperScroller,
      snaplines: snaplines,
      width: 240,
      groups: this.getStencilGroups(),
      dropAnimation: true,
      groupsToggleButtons: true,
      paperOptions: function () {
        return {
          model: new dia.Graph(),
        };
      },
      search: {
        '*': ['type', 'attrs/root/dataTooltip', 'attrs/label/text'],
      },
      layout: {
        columns: 2,
        marginX: 10,
        marginY: 10,
        columnGap: 10,
        columnWidth: 100,
        rowHeight: 80,
      },
      // Remove tooltip definition from clone
      dragStartClone: (cell: dia.Cell) =>
        cell.clone().removeAttr('root/dataTooltip'),
    });
  }

  setShapes() {
    this.stencil.load(this.getStencilShapes());
  }

  getStencilGroups() {
    return <{ [key: string]: ui.Stencil.Group }>{
      standard: { index: 1, label: 'Standard shapes' },
    };
  }

  getStencilShapes() {
    return {
      standard: [
        {
          type: 'standard.Rectangle',
          size: { width: 90, height: 54 },
          attrs: {
            root: {
              dataTooltip: 'Rectangle',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              rx: 2,
              ry: 2,
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'rect',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
        },
        {
          type: 'standard.Ellipse',
          size: { width: 90, height: 54 },
          attrs: {
            root: {
              dataTooltip: 'Ellipse',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'ellipse',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
        },
        {
          type: 'app.RectangularModel',
          size: { width: 90, height: 67.5 },
          allowOrthogonalResize: false,
          attrs: {
            root: {
              dataTooltip: 'Rectangle with ports',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              fill: 'transparent',
              rx: 2,
              ry: 2,
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'rect',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
          ports: {
            items: [{ group: 'in' }, { group: 'in' }, { group: 'out' }],
          },
        },
        {
          type: 'app.CircularModel',
          size: { width: 90, height: 54 },
          allowOrthogonalResize: false,
          attrs: {
            root: {
              dataTooltip: 'Ellipse with ports',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'ellipse',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
          ports: {
            items: [{ group: 'in' }, { group: 'in' }, { group: 'out' }],
          },
        },
        {
          type: 'standard.Polygon',
          size: { width: 90, height: 54 },
          attrs: {
            root: {
              dataTooltip: 'Rhombus',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              points:
                'calc(0.5 * w),0 calc(w),calc(0.5 * h) calc(0.5 * w),calc(h) 0,calc(0.5 * h)',
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'rhombus',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
        },
        {
          type: 'standard.Cylinder',
          size: { width: 90, height: 54 },
          attrs: {
            root: {
              dataTooltip: 'Cylinder',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            top: {
              fill: '#31d0c6',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'cylinder',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
        },
        {
          type: 'standard.Image',
          size: { width: 90, height: 71 },
          attrs: {
            root: {
              dataTooltip: 'Image',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            image: {
              xlinkHref: 'assets/image-icon1.svg',
            },
            body: {
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            label: {
              text: 'image',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              fill: '#c6c7e2',
            },
          },
        },
        {
          type: 'standard.EmbeddedImage',
          size: { width: 90, height: 54 },
          attrs: {
            root: {
              dataTooltip: 'Card',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            image: {
              xlinkHref: 'assets/image-icon1.svg',
            },
            label: {
              text: 'card',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
        },
        {
          type: 'standard.InscribedImage',
          size: { width: 60, height: 60 },
          attrs: {
            root: {
              dataTooltip: 'Icon',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            border: {
              stroke: '#31d0c6',
              strokeWidth: 3,
              strokeDasharray: '0',
            },
            background: {
              fill: 'transparent',
            },
            image: {
              xlinkHref: 'assets/image-icon1.svg',
            },
            label: {
              text: 'icon',
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
            },
          },
        },
        {
          type: 'standard.HeaderedRectangle',
          size: { width: 90, height: 54 },
          attrs: {
            root: {
              dataTooltip: 'Rectangle with header',
              dataTooltipPosition: 'left',
              dataTooltipPositionSelector: '.joint-stencil',
            },
            body: {
              fill: 'transparent',
              stroke: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
            },
            header: {
              stroke: '#31d0c6',
              fill: '#31d0c6',
              strokeWidth: 2,
              strokeDasharray: '0',
              height: 20,
            },
            bodyText: {
              textWrap: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie.',
                width: -10,
                height: -20,
                ellipsis: true,
              },
              fill: '#c6c7e2',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
              y: 'calc(h/2 + 10)',
            },
            headerText: {
              text: 'header',
              fill: '#f6f6f6',
              fontFamily: 'Roboto Condensed',
              fontWeight: 'Normal',
              fontSize: 11,
              strokeWidth: 0,
              y: 10,
            },
          },
        },
      ],
    };
  }
}
