"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/data/i18n/types";
import { SECTION_LABELS, type SectionKey } from "@/lib/content/schema";
import {
  SECTION_CONFIGS,
  type Row,
  type RepeaterBlock,
} from "@/lib/admin/section-config";

type Fields = Record<string, string | string[]>;

export function SectionEditor({ section }: { section: SectionKey }) {
  const config = SECTION_CONFIGS[section];
  const repeater = config.blocks.find(
    (block): block is RepeaterBlock => block.kind === "repeater",
  );

  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fields, setFields] = useState<Fields>({});
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(
    async (nextLang: Lang) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const res = await fetch(`/api/admin/content?lang=${nextLang}`);
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Failed to load content.");
        const sectionData = body.content[section] as Record<string, unknown>;

        const nextFields: Fields = {};
        for (const block of config.blocks) {
          if (block.kind === "text" || block.kind === "list") {
            nextFields[block.key] = sectionData[block.key] as string | string[];
          }
        }
        setFields(nextFields);

        if (repeater) {
          const items = (sectionData[repeater.key] as Record<string, unknown>[]) ?? [];
          const toRow = repeater.toRow ?? ((item) => item as Row);
          setRows(items.map(toRow));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load content.");
      } finally {
        setLoading(false);
      }
    },
    [section, config, repeater],
  );

  useEffect(() => {
    load(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function updateField(key: string, value: string | string[]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function updateListItem(key: string, idx: number, value: string) {
    setFields((prev) => {
      const list = [...((prev[key] as string[]) ?? [])];
      list[idx] = value;
      return { ...prev, [key]: list };
    });
  }
  function addListItem(key: string) {
    setFields((prev) => ({ ...prev, [key]: [...((prev[key] as string[]) ?? []), ""] }));
  }
  function removeListItem(key: string, idx: number) {
    setFields((prev) => {
      const list = [...((prev[key] as string[]) ?? [])];
      list.splice(idx, 1);
      return { ...prev, [key]: list };
    });
  }

  function updateRow(idx: number, key: string, value: string | boolean) {
    setRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  }
  function addRow() {
    if (!repeater) return;
    setRows((prev) => [...prev, { ...repeater.emptyRow }]);
  }
  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveRow(idx: number, dir: -1 | 1) {
    setRows((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload: Record<string, unknown> = { ...fields };
      if (repeater) {
        const fromRow = repeater.fromRow ?? ((row) => row as Record<string, unknown>);
        payload[repeater.key] = rows.map(fromRow);
      }
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, section, data: payload }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed.");
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-medium text-ink-primary">{SECTION_LABELS[section]}</h1>
        <div className="flex rounded-md border border-white/10 p-0.5">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded px-3 py-1 text-xs uppercase transition ${
                lang === l ? "bg-white/10 text-ink-primary" : "text-ink-secondary"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ink-secondary">Loading…</p>
      ) : (
        <div className="space-y-6">
          {config.blocks.map((block) => {
            if (block.kind === "text") {
              return (
                <div key={block.key}>
                  <label className="mb-1 block text-sm text-ink-secondary">{block.label}</label>
                  {block.area ? (
                    <textarea
                      rows={4}
                      value={(fields[block.key] as string) ?? ""}
                      onChange={(e) => updateField(block.key, e.target.value)}
                      className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(fields[block.key] as string) ?? ""}
                      onChange={(e) => updateField(block.key, e.target.value)}
                      className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30"
                    />
                  )}
                </div>
              );
            }

            if (block.kind === "list") {
              const list = (fields[block.key] as string[]) ?? [];
              return (
                <div key={block.key}>
                  <label className="mb-1 block text-sm text-ink-secondary">{block.label}</label>
                  <div className="space-y-2">
                    {list.map((value, idx) =>
                      block.area ? (
                        <div key={idx} className="flex gap-2">
                          <textarea
                            rows={3}
                            value={value}
                            onChange={(e) => updateListItem(block.key, idx, e.target.value)}
                            className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(block.key, idx)}
                            className="shrink-0 self-start text-xs text-ink-secondary hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateListItem(block.key, idx, e.target.value)}
                            className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(block.key, idx)}
                            className="shrink-0 text-xs text-ink-secondary hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addListItem(block.key)}
                    className="mt-2 text-xs text-ink-secondary hover:text-ink-primary"
                  >
                    + Add line
                  </button>
                </div>
              );
            }

            return (
              <div key={block.key}>
                <label className="mb-2 block text-sm text-ink-secondary">{block.label}</label>
                <div className="space-y-3">
                  {rows.map((row, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-card p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-ink-secondary">
                          {block.itemLabel} {idx + 1}
                        </span>
                        <div className="flex gap-2 text-xs text-ink-secondary">
                          <button type="button" onClick={() => moveRow(idx, -1)} className="hover:text-ink-primary">
                            ↑
                          </button>
                          <button type="button" onClick={() => moveRow(idx, 1)} className="hover:text-ink-primary">
                            ↓
                          </button>
                          <button type="button" onClick={() => removeRow(idx)} className="hover:text-red-400">
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {block.fields.map((field) => (
                          <div
                            key={field.key}
                            className={field.type === "textarea" ? "sm:col-span-2" : ""}
                          >
                            <label className="mb-1 block text-xs text-ink-secondary">
                              {field.label}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                rows={3}
                                value={(row[field.key] as string) ?? ""}
                                onChange={(e) => updateRow(idx, field.key, e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30"
                              />
                            ) : field.type === "checkbox" ? (
                              <input
                                type="checkbox"
                                checked={Boolean(row[field.key])}
                                onChange={(e) => updateRow(idx, field.key, e.target.checked)}
                                className="h-4 w-4"
                              />
                            ) : (
                              <input
                                type="text"
                                value={(row[field.key] as string) ?? ""}
                                onChange={(e) => updateRow(idx, field.key, e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addRow}
                  className="mt-3 text-xs text-ink-secondary hover:text-ink-primary"
                >
                  + Add {block.itemLabel.toLowerCase()}
                </button>
              </div>
            );
          })}

          <div className="flex items-center gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-ink-primary px-4 py-2 text-sm font-medium text-bg-primary transition disabled:opacity-50"
            >
              {saving ? "Saving…" : `Save ${lang.toUpperCase()} content`}
            </button>
            {success && <span className="text-sm text-emerald-400">Saved.</span>}
            {error && <span className="text-sm text-red-400">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
