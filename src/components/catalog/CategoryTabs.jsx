import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Coffee, Cookie, LayoutGrid } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

// Optionally map known slugs to icons
const iconBySlug = {
  donuts: Cookie,
  drinks: Coffee,
};
const defaultIcon = LayoutGrid;

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  const { t, i18n } = useTranslation();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend (with optional language for translated names)
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
        setCats([]); // fail soft → still render "All"
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [i18n.language]);

  // Build the tabs: "All" + API categories
  const tabs = useMemo(() => {
    const allTab = {
      id: "all",
      icon: LayoutGrid,
      title: t("catalog_gate_all"),
    };

    const apiTabs = cats.map((c) => {
      const Icon = iconBySlug[c.slug] || defaultIcon;
      const translated = c.translated || {};
      const title = translated.name || c.name || c.slug;
      return { id: c.slug, icon: Icon, title };
    });

    return [allTab, ...apiTabs];
  }, [cats, t]);

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white dark:bg-dark-surface p-2 rounded-full shadow-soft flex items-center space-x-2">
        {tabs.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-colors flex items-center gap-2",
                isActive
                  ? "text-white"
                  : "text-chocolate-brown dark:text-soft-cream/80 hover:bg-soft-cream dark:hover:bg-dark-bg"
              )}
              aria-pressed={isActive}
              disabled={loading && cat.id !== "all" && tabs.length === 1}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute inset-0 bg-amber-orange rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <Icon className="w-5 h-5" />
              </span>
              <span className="relative z-10">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
