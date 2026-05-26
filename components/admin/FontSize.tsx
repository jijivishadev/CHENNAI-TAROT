import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const style = element.getAttribute("style");
              const match = style?.match(/font-size:\s*(\d+)px/);
              return match ? match[1] : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }) => {
        return chain().setMark("textStyle", { fontSize: size }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark("textStyle", { fontSize: null }).run();
      },
    };
  },
});