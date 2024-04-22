import * as joint from '@joint/plus';

// extend joint.shapes namespace

declare module '@joint/plus' {
  namespace shapes {
    namespace app {
      class RoleGroup extends joint.shapes.standard.Rectangle {
        placeholder: string;
        fitRoles(): void;
      }
      class Role extends joint.shapes.standard.Rectangle {
        placeholder: any;
        setName(name: any): void;
      }
      class Lifeline extends joint.shapes.standard.Link {
        attachToRole(role: any, maxY: any): void;
      }
      class LifeSpan extends joint.dia.Link {
        attachToMessages(from: any, to: any): void;
      }
      class Message extends joint.shapes.standard.Link {
        placeholder: any;
        defaultLabel: {
          markup: any;
          attrs: {
            labelBody: any;
            labelText: any;
          };
        };
        setStart(y: any): void;
        setFromTo(from: any, to: any): void;
        setDescription(description: any): void;
      }
    }
  }
}

const RoleGroup = joint.shapes.standard.Rectangle.define(
  'app.RoleGroup',
  {
    z: 1,
    attrs: {
      body: {
        stroke: '#DDDDDD',
        strokeWidth: 1,
        fill: '#F9FBFA',
      },
      label: {
        refY: null,
        refX: null,
        y: 'calc(h+2)',
        x: 'calc(w/2)',
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fontFamily: 'sans-serif',
        textWrap: {
          width: -10,
        },
      },
    },
  },
  {
    placeholder: "What's the group's name?",

    fitRoles: function () {
      this.fitToChildren({ padding: 10 });
    },
  }
);
const Role = joint.shapes.standard.Rectangle.define(
  'app.Role',
  {
    z: 2,
    size: { width: 100, height: 80 },
    attrs: {
      body: {
        stroke: '#A0A0A0',
        strokeWidth: 1,
        rx: 2,
        ry: 2,
      },
      label: {
        fontSize: 18,
        fontFamily: 'sans-serif',
        textWrap: {
          width: -10,
        },
      },
    },
  },
  {
    placeholder: "What's the role?",

    setName: function (name: any) {
      this.attr(['label', 'text'], name);
    },
  }
);

const Lifeline = joint.shapes.standard.Link.define(
  'app.Lifeline',
  {
    z: 3,
    attrs: {
      line: {
        stroke: '#A0A0A0',
        strokeWidth: 1,
        strokeDasharray: '5,2',
        targetMarker: null,
      },
    },
  },
  {
    attachToRole: function (role: any, maxY: any) {
      const roleCenter = role.getBBox().center();
      this.set({
        source: { id: role.id },
        target: { x: roleCenter.x, y: maxY },
      });
      role.embed(this);
    },
  }
);

const LifeSpan = joint.dia.Link.define(
  'app.LifeSpan',
  {
    z: 4,
    attrs: {
      line: {
        connection: true,
        stroke: '#222222',
        strokeWidth: 2,
      },
      wrapper: {
        connection: true,
      },
      icon: {
        atConnectionRatioIgnoreGradient: 0.5,
      },
    },
  },
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
        attributes: {
          fill: 'none',
          'pointer-events': 'none',
        },
      },
      {
        tagName: 'path',
        selector: 'wrapper',
        attributes: {
          fill: 'none',
          stroke: 'transparent',
          'stroke-width': 20,
        },
      },
      {
        tagName: 'g',
        selector: 'icon',
        children: [
          {
            tagName: 'circle',
            attributes: {
              r: 12,
              fill: '#222222',
            },
          },
          {
            tagName: 'path',
            attributes: {
              d: 'M -3 -5 3 -5 3 -2 -3  2 -3 5 3 5 3 2 -3 -2 Z',
              stroke: '#FFFFFF',
              'stroke-width': 1,
              fill: 'none',
            },
          },
        ],
      },
    ],
    attachToMessages: function (from: any, to: any) {
      this.source(from, {
        anchor: { name: 'connectionRatio', args: { ratio: 1 } },
      });
      this.target(to, {
        anchor: { name: 'connectionRatio', args: { ratio: 0 } },
      });
    },
  }
);

const Message = joint.shapes.standard.Link.define(
  'app.Message',
  {
    z: 5,
    source: { anchor: { name: 'connectionLength' } },
    target: { anchor: { name: 'connectionPerpendicular' } },
    attrs: {
      line: {
        stroke: '#4666E5',
        sourceMarker: {
          type: 'path',
          d: 'M -3 -3 -3 3 3 3 3 -3 z',
          'stroke-width': 3,
        },
      },
      wrapper: {
        strokeWidth: 20,
        cursor: 'grab',
      },
    },
  },
  {
    placeholder: "What's the message?",

    defaultLabel: {
      markup: [
        {
          tagName: 'rect',
          selector: 'labelBody',
        },
        {
          tagName: 'text',
          selector: 'labelText',
        },
      ],
      attrs: {
        labelBody: {
          ref: 'labelText',
          width: 'calc(w + 20)',
          height: 'calc(h + 10)',
          x: 'calc(x - 10)',
          y: 'calc(y - 5)',
          rx: 2,
          ry: 2,
          fill: '#4666E5',
        },
        labelText: {
          fill: '#FFFFFF',
          fontSize: 12,
          fontFamily: 'sans-serif',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          cursor: 'grab',
        },
      },
    },
    setStart: function (y: any) {
      this.prop(['source', 'anchor', 'args', 'length'], y);
    },
    setFromTo: function (from: any, to: any) {
      this.prop({
        source: { id: from.id },
        target: { id: to.id },
      });
    },
    setDescription: function (description: any) {
      this.labels([{ attrs: { labelText: { text: description } } }]);
    },
  }
);
(<any>Object).assign(joint.shapes, {
  app: {
    RoleGroup,
    Role,
    Lifeline,
    LifeSpan,
    Message,
  },
});
