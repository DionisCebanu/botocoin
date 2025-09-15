import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Coffee, Cookie, LayoutGrid } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "https://event-api.dioniscode.com/public/api";

const iconBySlug = { donuts: Cookie, drinks: Coffee };
const defaultIcon = LayoutGrid;

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  const { t, i18n } = useTranslation();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const url = new URL(`${API_BASE}/categories`);
    url.searchParams.set("lang", i18n.language || "en");

    fetch(url.toString())
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load categories");
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        const arr = Array.isArray(json?.data) ? json.data : [];
        setCats(arr);
      })
      .catch(() => {
        if (!alive) return;
        setCats([]);
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [i18n.language]);

  const tabs = useMemo(() => {
    const allTab = { id: "all", icon: LayoutGrid, title: t("catalog_gate_all") };
    const apiTabs = cats.map((c) => {
      const Icon = iconBySlug[c.slug] || defaultIcon;
      const tr = c.translated || {};
      return { id: c.slug, icon: Icon, title: tr.name || c.name || c.slug };
    });
    return [allTab, ...apiTabs];
  }, [cats, t]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 mb-6">
      <div className="bg-white dark:bg-dark-surface p-1 rounded-full shadow-soft">
        <div
          role="tablist"
          aria-label={t("categories") || "Categories"}
          className="
            flex flex-nowrap items-center gap-2
            overflow-x-auto no-scrollbar
            snap-x snap-mandatory justify-around
          "
        >
          {tabs.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(cat.id)}
                disabled={loading && cat.id !== "all" && tabs.length === 1}
                className={cn(
                  "relative shrink-0 snap-start min-w-0",
                  // paddings/typos responsive
                  "px-3 py-2 sm:px-5 sm:py-2.5",
                  "rounded-full text-sm sm:text-base font-semibold transition-colors",
                  "flex items-center gap-1.5 sm:gap-2",
                  isActive
                    ? "text-white"
                    : "text-chocolate-brown dark:text-soft-cream/80 hover:bg-soft-cream dark:hover:bg-dark-bg"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 rounded-full bg-amber-orange"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="relative z-10 truncate max-w-[8rem] sm:max-w-none">
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
