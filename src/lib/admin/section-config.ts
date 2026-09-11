import type { SectionKey } from "@/lib/content/schema";

export type RowField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "checkbox";
};

export type Row = Record<string, string | boolean>;

export type TextBlock = { kind: "text"; key: string; label: string; area?: boolean };
export type ListBlock = { kind: "list"; key: string; label: string; area?: boolean };
export type RepeaterBlock = {
  kind: "repeater";
  key: string;
  label: string;
  itemLabel: string;
  fields: RowField[];
  emptyRow: Row;
  /** Transform a stored item into a flat editable row. Defaults to identity. */
  toRow?: (item: Record<string, unknown>) => Row;
  /** Transform an edited row back into the stored item shape. Defaults to identity. */
  fromRow?: (row: Row) => Record<string, unknown>;
};

export type Block = TextBlock | ListBlock | RepeaterBlock;

export type SectionConfig = {
  key: SectionKey;
  blocks: Block[];
};

const csvToList = (value: unknown): string =>
  Array.isArray(value) ? value.join(", ") : "";
const listFromCsv = (value: string): string[] =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

export const SECTION_CONFIGS: Record<SectionKey, SectionConfig> = {
  hero: {
    key: "hero",
    blocks: [
      { kind: "text", key: "kicker", label: "Kicker" },
      { kind: "list", key: "titleLines", label: "Headline lines" },
      { kind: "list", key: "roles", label: "Roles" },
      { kind: "text", key: "tagline", label: "Tagline", area: true },
    ],
  },
  about: {
    key: "about",
    blocks: [
      { kind: "text", key: "heading", label: "Heading", area: true },
      { kind: "list", key: "paragraphs", label: "Paragraphs", area: true },
      {
        kind: "repeater",
        key: "facts",
        label: "Facts",
        itemLabel: "Fact",
        fields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
        emptyRow: { value: "", label: "" },
      },
    ],
  },
  services: {
    key: "services",
    blocks: [
      { kind: "text", key: "title", label: "Section title" },
      {
        kind: "repeater",
        key: "items",
        label: "Services",
        itemLabel: "Service",
        fields: [
          { key: "index", label: "Index (e.g. 01)", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
        emptyRow: { index: "", title: "", description: "" },
      },
    ],
  },
  projects: {
    key: "projects",
    blocks: [
      { kind: "text", key: "title", label: "Section title" },
      {
        kind: "repeater",
        key: "items",
        label: "Projects",
        itemLabel: "Project",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "tag", label: "Tag", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "tech", label: "Tech (comma-separated)", type: "text" },
          { key: "linkLabel", label: "Link label", type: "text" },
          { key: "linkHref", label: "Link URL", type: "text" },
          { key: "image", label: "Image path (under /public)", type: "text" },
          { key: "country", label: "Country", type: "text" },
        ],
        emptyRow: {
          title: "",
          tag: "",
          description: "",
          tech: "",
          linkLabel: "",
          linkHref: "",
          image: "",
          country: "",
        },
        toRow: (item) => ({
          title: String(item.title ?? ""),
          tag: String(item.tag ?? ""),
          description: String(item.description ?? ""),
          tech: csvToList(item.tech),
          linkLabel: String((item.links as Array<{ label?: string }>)?.[0]?.label ?? ""),
          linkHref: String((item.links as Array<{ href?: string }>)?.[0]?.href ?? ""),
          image: String(item.image ?? ""),
          country: String(item.country ?? ""),
        }),
        fromRow: (row) => {
          const links = row.linkHref || row.linkLabel
            ? [{ label: String(row.linkLabel || ""), href: String(row.linkHref || "") }]
            : [];
          return {
            title: row.title,
            tag: row.tag,
            description: row.description,
            tech: listFromCsv(String(row.tech || "")),
            links,
            ...(row.image ? { image: row.image } : {}),
            ...(row.country ? { country: row.country } : {}),
          };
        },
      },
    ],
  },
  experience: {
    key: "experience",
    blocks: [
      { kind: "text", key: "title", label: "Section title" },
      {
        kind: "repeater",
        key: "items",
        label: "Experience",
        itemLabel: "Entry",
        fields: [
          { key: "date", label: "Date range", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "org", label: "Organization (optional)", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
        emptyRow: { date: "", role: "", org: "", description: "" },
        fromRow: (row) => ({
          date: row.date,
          role: row.role,
          description: row.description,
          ...(row.org ? { org: row.org } : {}),
        }),
      },
    ],
  },
  techStack: {
    key: "techStack",
    blocks: [
      { kind: "text", key: "title", label: "Section title" },
      {
        kind: "repeater",
        key: "groups",
        label: "Groups",
        itemLabel: "Group",
        fields: [
          { key: "title", label: "Group title", type: "text" },
          { key: "items", label: "Items (comma-separated)", type: "text" },
        ],
        emptyRow: { title: "", items: "" },
        toRow: (item) => ({
          title: String(item.title ?? ""),
          items: csvToList(item.items),
        }),
        fromRow: (row) => ({
          title: row.title,
          items: listFromCsv(String(row.items || "")),
        }),
      },
    ],
  },
  faq: {
    key: "faq",
    blocks: [
      { kind: "text", key: "title", label: "Section title" },
      {
        kind: "repeater",
        key: "items",
        label: "Questions",
        itemLabel: "Question",
        fields: [
          { key: "index", label: "Index (e.g. 01)", type: "text" },
          { key: "question", label: "Question", type: "text" },
          { key: "answer", label: "Answer", type: "textarea" },
        ],
        emptyRow: { index: "", question: "", answer: "" },
      },
    ],
  },
  contact: {
    key: "contact",
    blocks: [
      { kind: "list", key: "heading", label: "Heading lines" },
      { kind: "text", key: "text", label: "Intro text", area: true },
      {
        kind: "repeater",
        key: "links",
        label: "Contact links",
        itemLabel: "Link",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "text" },
          { key: "value", label: "Display value", type: "text" },
          { key: "external", label: "Opens externally", type: "checkbox" },
        ],
        emptyRow: { label: "", href: "", value: "", external: false },
      },
    ],
  },
};
