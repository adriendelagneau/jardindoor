"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ------------------ types ------------------ */
export type SearchSuggestion = {
  label: string;
  query: string;

  category?: string;
  subCategory?: string;
  brand?: string;
  product?: string;

  from: "title" | "product" | "category";
};

type RecentSearch = SearchSuggestion & {
  timestamp: number;
};

/* ------------------ constants ------------------ */
const RECENT_KEY = "recent-searches";
const MAX_RECENT = 2;
const MAX_SUGGESTIONS = 3;

/* ------------------ helpers ------------------ */
const getRecentSearches = (): RecentSearch[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveRecentSearch = (s: SearchSuggestion) => {
  const current = getRecentSearches();

  const updated = [
    { ...s, timestamp: Date.now() },
    ...current.filter(
      (r) =>
        r.query !== s.query ||
        r.category !== s.category ||
        r.subCategory !== s.subCategory ||
        r.product !== s.product
    ),
  ].slice(0, MAX_RECENT);

  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
};

/* ------------------ component ------------------ */
export function NavSearchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ------------------ STATE ------------------ */
  const [value, setValue] = useState(searchParams.get("query") ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent overwriting input after manual selection
  const [isManualSelection, setIsManualSelection] = useState(false);

  const allItems = [...suggestions, ...recentSearches];
  const itemCount = allItems.length;

  const showDropdown =
    open && (loading || value.trim().length >= 2 || recentSearches.length > 0);

  /* ------------------ SYNC INPUT WITH URL ------------------ */
  useEffect(() => {
    if (isManualSelection) return;

    setValue(searchParams.get("query") ?? "");
  }, [searchParams, isManualSelection]);

  /* ------------------ SUGGESTIONS ------------------ */
  useEffect(() => {
    if (!open || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(value.trim())}`
        );

        if (!res.ok) throw new Error("Failed");

        const data: SearchSuggestion[] = await res.json();
        setSuggestions(data.slice(0, MAX_SUGGESTIONS));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [value, open]);

  /* Reset selection */
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions, recentSearches]);

  /* Click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ------------------ ACTIONS ------------------ */
  const submitSuggestion = (s: SearchSuggestion) => {
    setIsManualSelection(true);
    setValue(s.label); // ✅ show label in input

    const params = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams();

    newParams.set("query", s.query);

    if (s.category) newParams.set("category", s.category);
    if (s.subCategory) newParams.set("subCategory", s.subCategory);
    if (s.brand) newParams.set("brand", s.brand);
    if (s.product) newParams.set("product", s.product);

    for (const [key, value] of params.entries()) {
      if (!["query", "category", "subCategory", "brand", "product"].includes(key)) {
        newParams.set(key, value);
      }
    }

    saveRecentSearch(s);
    setRecentSearches(getRecentSearches());

    if (s.product) {
      router.push(`/products/${s.product}`);
    } else {
      router.push(`/products?${newParams.toString()}`);
    }
    setOpen(false);
  };

  const submitFreeSearch = () => {
    if (!value.trim()) return;

    setIsManualSelection(true);

    submitSuggestion({
      label: value.trim(),
      query: value.trim(),
      from: "title",
    });
  };

  const resetSearch = () => {
    setValue("");
    setSuggestions([]);
    setOpen(false);
    setIsManualSelection(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : `/products`);
  };

  /* ------------------ UI ------------------ */
  return (
    <div ref={containerRef} className="relative w-full lg:max-w-md z-50">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

      <input
        value={value}
        placeholder="Rechercher sur JARDIN INDOOR"
        className="bg-background focus:ring-primary h-11 w-full rounded-4xl border pr-10 pl-9 text-sm focus:ring-2 focus:outline-none"
        onChange={(e) => {
          setValue(e.target.value);
          setIsManualSelection(false);
          setOpen(true);
        }}
        onFocus={() => {
          setRecentSearches(getRecentSearches());
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < allItems.length) {
              submitSuggestion(allItems[selectedIndex]);
            } else {
              submitFreeSearch();
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (itemCount > 0) {
              setSelectedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
            }
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (itemCount > 0) {
              setSelectedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />

      {value && (
        <button
          type="button"
          onClick={resetSearch}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}

      {showDropdown && (
        <div className="bg-background absolute z-50 mt-2 w-full rounded-md border shadow-lg">
          {/* Suggestions */}
          {value.trim() !== "" && (
            <>
              {loading ? (
                <div className="text-muted-foreground px-4 py-3 text-sm">
                  Recherche…
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="divide-y">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onMouseDown={() => submitSuggestion(s)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`cursor-pointer px-4 py-2 ${
                        selectedIndex === i ? "bg-muted" : "hover:bg-muted"
                      }`}
                    >
                      <div className="text-sm font-medium">{s.label}</div>

                      {(s.category || s.subCategory || s.product) && (
                        <div className="text-muted-foreground mt-0.5 text-xs">
                          {[s.category, s.subCategory, s.product]
                            .filter(Boolean)
                            .join(" › ")}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground px-4 py-3 text-sm">
                  Aucun résultat
                </div>
              )}
            </>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="border-b">
              <p className="text-muted-foreground px-4 py-2 text-xs font-medium uppercase">
                Recherches récentes
              </p>
              <ul>
                {recentSearches.map((s, i) => {
                  const index = suggestions.length + i;
                  return (
                    <li
                      key={s.timestamp}
                      onMouseDown={() => submitSuggestion(s)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`cursor-pointer px-4 py-2 text-sm ${
                        selectedIndex === index ? "bg-muted" : "hover:bg-muted"
                      }`}
                    >
                      🔁 {s.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
