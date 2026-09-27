"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/data/i18n/types";
import { SECTION_LABELS, type SectionKey } from "@/lib/content/schema";
import {
  SECTION_CONFIGS,
  type Row,
  type RepeaterBlock,
} from "@/lib/admin/section-config";
import { Skeleton } from "@/components/ui/Skeleton";
import { ImageDropField } from "./ImageDropField";

type Fields = Record<string, string | string[]>;

const otherLang = (l: Lang): Lang => (l === "en" ? "ar" : "en");

async function fetchSection(lang: Lang, section: SectionKey) {
  const res = await fetch(`/api/admin/content?lang=${lang}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed to load content.");
  return body.content[section] as Record<string, unknown>;
}

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
  // For each row, its index in the list as loaded (-1 for newly added rows).
  // Used to apply the same reorder/add/remove to the other language on save.
  const [origins, setOrigins] = useState<number[]>([]);
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    setDirty(true);
    setSuccess(false);
  }

  const load = useCallback(
    async (nextLang: Lang) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setDirty(false);
      try {
        const sectionData = await fetchSection(nextLang, section);

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
          setOrigins(items.map((_, i) => i));
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

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function switchLang(next: Lang) {
    if (next === lang) return;
    if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    setLang(next);
  }

  function updateField(key: string, value: string | string[]) {
    markDirty();
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function updateListItem(key: string, idx: number, value: string) {
    markDirty();
    setFields((prev) => {
      const list = [...((prev[key] as string[]) ?? [])];
      list[idx] = value;
      return { ...prev, [key]: list };
    });
  }
  function addListItem(key: string) {
    markDirty();
    setFields((prev) => ({ ...prev, [key]: [...((prev[key] as string[]) ?? []), ""] }));
  }
  function removeListItem(key: string, idx: number) {
    markDirty();
    setFields((prev) => {
      const list = [...((prev[key] as string[]) ?? [])];
      list.splice(idx, 1);
      return { ...prev, [key]: list };
    });
  }

  function updateRow(idx: number, key: string, value: string | boolean) {
    markDirty();
    setRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  }
  function addRow() {
    if (!repeater) return;
    markDirty();
    setRows((prev) => [...prev, { ...repeater.emptyRow }]);
    setOrigins((prev) => [...prev, -1]);
  }
  function removeRow(idx: number) {
    markDirty();
    setRows((prev) => prev.filter((_, i) => i !== idx));
    setOrigins((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveRow(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    markDirty();
    function swap<T>(list: T[]) {
      const next = [...list];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    }
    setRows(swap);
    setOrigins(swap);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload: Record<string, unknown> = { ...fields };
      const entries = [{ lang, data: payload }];

      if (repeater) {
        const toRow = repeater.toRow ?? ((item) => item as Row);
        const fromRow = repeater.fromRow ?? ((row) => row as Record<string, unknown>);
        payload[repeater.key] = rows.map(fromRow);

        // Mirror the list into the other language: same order, additions and
        // removals, with shared (untranslated) fields copied across. Its own
        // translated text is kept; brand-new rows start as a copy of this one.
        const other = otherLang(lang);
        const otherData = await fetchSection(other, section);
        const otherRows = ((otherData[repeater.key] as Record<string, unknown>[]) ?? []).map(toRow);
        const shared = repeater.sharedFields ?? [];
        const mirrored = rows.map((row, i) => {
          const base = otherRows[origins[i]] ?? row;
          const copied = Object.fromEntries(shared.map((key) => [key, row[key]]));
          return fromRow({ ...base, ...copied });
        });
        entries.push({ lang: other, data: { ...otherData, [repeater.key]: mirrored } });
      }

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, entries }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed.");
      // Both languages now share this order.
      setOrigins(rows.map((_, i) => i));
      setDirty(false);
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
              onClick={() => switchLang(l)}
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
        <div className="space-y-6">
          {config.blocks.map((block, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-3 w-32" />
              {block.kind === "repeater" ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="rounded-lg border border-white/10 bg-card p-3">
                      <Skeleton className="mb-3 h-3 w-20" />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {block.fields.map((field) => (
                          <Skeleton
                            key={field.key}
                            className={`h-9 ${
                              field.type === "textarea" || field.type === "image"
                                ? "sm:col-span-2 h-20"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : block.kind === "list" ? (
                <div className="space-y-2">
                  <Skeleton className={block.area ? "h-16 w-full" : "h-9 w-full"} />
                  <Skeleton className={block.area ? "h-16 w-full" : "h-9 w-full"} />
                </div>
              ) : (
                <Skeleton className={block.area ? "h-20 w-full" : "h-9 w-full"} />
              )}
            </div>
          ))}
        </div>
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
                            className={
                              field.type === "textarea" || field.type === "image"
                                ? "sm:col-span-2"
                                : ""
                            }
                          >
                            <label className="mb-1 block text-xs text-ink-secondary">
                              {field.label}
                            </label>
                            {field.type === "image" ? (
                              <ImageDropField
                                value={(row[field.key] as string) ?? ""}
                                onChange={(url) => updateRow(idx, field.key, url)}
                              />
                            ) : field.type === "textarea" ? (
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

          <div className="fixed bottom-6 right-6 z-40 flex max-w-[calc(100vw-3rem)] items-center gap-3 rounded-lg border border-white/10 bg-card/95 py-2 pl-4 pr-2 shadow-lg backdrop-blur">
            <span aria-live="polite" className="text-sm">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : saving ? (
                <span className="text-ink-secondary">Saving…</span>
              ) : dirty ? (
                <span className="text-amber-400">Unsaved changes</span>
              ) : success ? (
                <span className="text-emerald-400">Saved</span>
              ) : (
                <span className="text-ink-secondary">No changes</span>
              )}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="shrink-0 rounded-md bg-ink-primary px-4 py-2 text-sm font-medium text-bg-primary transition disabled:opacity-50"
            >
              {saving ? "Saving…" : `Save ${lang.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
