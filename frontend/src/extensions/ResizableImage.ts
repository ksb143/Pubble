import {
  Node,
  mergeAttributes,
  NodeViewRenderer,
  NodeViewProps,
} from '@tiptap/core';

export interface ResizableImageOptions {
  inline: boolean;
  allowBase64: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      /**
       * Add an image
       */
      setResizableImage: (options: {
        src: string;
        width: number;
      }) => ReturnType;
    };
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: 'resizableImage',

  inline: true,

  group: 'inline',

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      inline: true,
      allowBase64: false,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 300,
        parseHTML: (element) => element.getAttribute('width') || 300,
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setResizableImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView(): NodeViewRenderer {
    return (props) => {
      // Cast props to NodeViewProps
      const { node, updateAttributes, deleteNode, selected, extension } =
        props as unknown as NodeViewProps;

      const img = document.createElement('img');
      img.setAttribute('src', node.attrs.src);
      img.style.width = node.attrs.width + 'px';
      img.draggable = false;

      const handle = document.createElement('div');
      handle.contentEditable = 'false';
      handle.style.width = '10px';
      handle.style.height = '10px';
      handle.style.background = 'gray';
      handle.style.cursor = 'nwse-resize';
      handle.style.position = 'absolute';
      handle.style.right = '0';
      handle.style.bottom = '0';
      handle.style.userSelect = 'none';

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      wrapper.append(img);
      wrapper.append(handle);

      const startDrag = (event: MouseEvent) => {
        event.preventDefault();

        const startWidth = parseInt(
          document.defaultView!.getComputedStyle(img).width,
          10,
        );
        const startX = event.clientX;

        const doDrag = (dragEvent: MouseEvent) => {
          img.style.width = startWidth + dragEvent.clientX - startX + 'px';
        };

        const stopDrag = () => {
          document.documentElement.removeEventListener(
            'mousemove',
            doDrag,
            false,
          );
          document.documentElement.removeEventListener(
            'mouseup',
            stopDrag,
            false,
          );
          if (typeof updateAttributes === 'function') {
            updateAttributes({ width: parseInt(img.style.width, 10) });
          }
        };

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
      };

      handle.addEventListener('mousedown', startDrag, false);

      return {
        dom: wrapper,
        contentDOM: null,
        updateAttributes,
        deleteNode,
        selected,
        extension,
      };
    };
  },
});
