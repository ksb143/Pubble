import { Node, NodeViewRenderer } from '@tiptap/core';

export const ExtendedImageExtension = Node.create({
  name: 'extendedImage',
  group: 'block',
  inline: false,
  draggable: true,

  addAttributes() {
    return {
      src: {},
      html: { default: null },
      css: { default: null },
      javascript: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (domNode) => ({
          src: domNode.getAttribute('src'),
          html: domNode.getAttribute('data-html'),
          css: domNode.getAttribute('data-css'),
          javascript: domNode.getAttribute('data-javascript'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes];
  },

  addNodeView(): NodeViewRenderer {
    return ({ node }) => {
      const img = document.createElement('img');

      img.src = node.attrs.src;
      img.style.width = `${node.attrs.width}px`;
      img.style.cursor = 'pointer';
      img.setAttribute('src', node.attrs.src);

      img.addEventListener('click', () => {
        const event = new CustomEvent('codeImageClicked', {
          detail: {
            html: node.attrs.html,
            css: node.attrs.css,
            javascript: node.attrs.javascript,
          },
        });
        document.dispatchEvent(event);
      });

      return {
        dom: img,
        update(updatedNode) {
          if (updatedNode.type.name === 'codeImage') {
            img.src = updatedNode.attrs.src;
            img.style.width = `${updatedNode.attrs.width}px`;
            return true;
          }
          return false;
        },
      };
    };
  },
});
