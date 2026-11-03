type MarkdownNode = {
  type: string;
  value?: string;
  alt?: string;
  lang?: string | null;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
};

/** Heading IDs exist in server HTML and remain unique across repeated titles. */
export function remarkHeadingIds() {
  return (tree: MarkdownNode) => {
    const used = new Set<string>();
    const text = (node: MarkdownNode): string =>
      node.value ?? node.alt ?? node.children?.map(text).join("") ?? "";
    const visit = (node: MarkdownNode) => {
      if (node.type === "code" && !node.lang) node.lang = "text";
      if (node.type === "heading") {
        const base =
          text(node)
            .normalize("NFKD")
            .replace(/\p{Mark}/gu, "")
            .toLowerCase()
            .replace(/[^\p{Letter}\p{Number}_-]+/gu, "-")
            .replace(/^-+|-+$/g, "") || "section";
        let id = base,
          suffix = 2;
        while (used.has(id)) id = `${base}-${suffix++}`;
        used.add(id);
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
