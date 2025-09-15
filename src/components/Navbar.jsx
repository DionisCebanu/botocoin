import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Instagram,
  Phone,
  Menu as MenuIcon,
  X,
  ShoppingCart,
  ShoppingBag,
  Info,
  Newspaper,
  Mail,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import NavWave from "./ui/NavWave";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useCart } from "@/context/CartContext";

/* =====================
   Logo
   ===================== */
const Logo = () => (
  <Link
    to="/"
    className="relative flex items-center justify-center group"
    aria-label="Le Botocoin Home"
  >
    <div className="w-20 h-20 bg-[rgb(249,175,7)] rounded-full shadow-md transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
      <img
        src="/img/logo/logo.png"
        alt="Le Botocoin Logo"
        className="w-12 h-12 object-contain"
      />
    </div>
  </Link>
);

/* =====================
   Navbar
   ===================== */
const Navbar = ({ onSocialClick, onCallClick, onOrderClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(""); // "#news", "#contact", etc.

  // Liens nav (route vs hash)
  const navLinks = useMemo(
    () => [
      { name: t("nav_catalog"), to: "/catalog", type: "route", icon: ShoppingBag },
      { name: t("nav_about"), to: "/about", type: "route", icon: Info },
      { name: t("nav_news"), to: "#news", type: "hash", icon: Newspaper },
      { name: t("nav_contact"), to: "#contact", type: "hash", icon: Mail },
    ],
    [t]
  );

  /* ===== Scroll header background ===== */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ===== Active hash via IntersectionObserver (sur la Home) ===== */
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    const ids = ["bestsellers", "donuts", "quality", "news", "gallery", "contact"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trouver la section la plus visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveHash(`#${visible.target.id}`);
        }
      },
      {
        root: null,
        // fenêtre d'activation “centrée” pour mieux refléter la section courante
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  /* ===== Scroll vers un hash depuis n'importe où ===== */
  const scrollWhenReady = (id, tries = 24) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Sync l’URL avec le hash
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }
    if (tries > 0) {
      setTimeout(() => scrollWhenReady(id, tries - 1), 50);
    }
  };

  const goToHash = (hash) => {
    const id = hash.replace("#", "");
    if (location.pathname !== "/") {
      navigate("/");
      // Attendre que la Home soit peinte puis scroller
      setTimeout(() => scrollWhenReady(id), 120);
    } else {
      scrollWhenReady(id);
    }
    setIsOpen(false);
  };

  /* ===== Helpers actif ===== */
  const isRouteActive = (to) => location.pathname === to;
  const isHashActive = (hash) =>
    location.pathname === "/" && (location.hash === hash || activeHash === hash);

  /* ===== Élément de menu “pill” réutilisable ===== */
  const PillRoute = ({ to, icon: Icon, label, active }) => (
  <li className="relative">
    {active && (
      <motion.span
        layoutId="navActivePill"
        className="pointer-events-none absolute inset-0 rounded-full 
                   bg-amber-400/15 ring-1 ring-amber-300/50 
                   dark:bg-amber-500/10 dark:ring-amber-500/30"
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      />
    )}
    <Link
      to={to}
      className="relative z-10 group flex items-center gap-2 px-4 py-2 rounded-full
                 font-semibold transition-colors
                 text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange"
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
      <span className="leading-none">{label}</span>
      <span
        className={`pointer-events-none absolute left-4 right-4 -bottom-1 h-0.5 rounded-full bg-amber-orange origin-left transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  </li>
);

const PillHash = ({ hash, icon: Icon, label, active, onClick }) => (
  <li className="relative">
    {active && (
      <motion.span
        layoutId="navActivePill"
        className="pointer-events-none absolute inset-0 rounded-full 
                   bg-amber-400/15 ring-1 ring-amber-300/50 
                   dark:bg-amber-500/10 dark:ring-amber-500/30"
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      />
    )}
    <button
      type="button"
      onClick={() => onClick(hash)}
      className="relative z-10 group flex items-center gap-2 px-4 py-2 rounded-full
                 font-semibold transition-colors
                 text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange"
      aria-current={active ? "page" : undefined}
      aria-label={label}
      title={label}
    >
      <Icon className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
      <span className="leading-none">{label}</span>
      <span
        className={`pointer-events-none absolute left-4 right-4 -bottom-1 h-0.5 rounded-full bg-amber-orange origin-left transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </button>
  </li>
);


  /* ===== Groupes gauche / droite autour du Logo ===== */
const LeftLinks = navLinks.slice(0, 2);
const RightLinks = navLinks.slice(2);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-soft-cream/90 dark:bg-dark-bg/90 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-24">
            {/* Logo mobile */}
            <Link
              to="/"
              className="font-logo text-3xl font-bold text-chocolate-brown dark:text-soft-cream md:hidden"
            >
              Le Botocoin
            </Link>

            {/* NAV Desktop */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              {/* Groupe gauche */}
              <ul className="isolate flex items-center gap-2 p-1 rounded-full bg-white/60 dark:bg-stone-900/60 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/40">
                {LeftLinks.map((l) =>
                  l.type === "route" ? (
                    <PillRoute key={l.to} to={l.to} icon={l.icon} label={l.name} active={isRouteActive(l.to)} />
                  ) : (
                    <PillHash  key={l.to} hash={l.to} icon={l.icon} label={l.name} active={isHashActive(l.to)} onClick={goToHash} />
                  )
                )}
              </ul>

              {/* Logo centre */}
              <div className="px-8 pt-4">
                <Logo />
              </div>

             {/* Groupe droite */}
            <ul className="isolate flex items-center gap-2 p-1 rounded-full bg-white/60 dark:bg-stone-900/60 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/40">
              {RightLinks.map((l) =>
                l.type === "route" ? (
                  <PillRoute key={l.to} to={l.to} icon={l.icon} label={l.name} active={isRouteActive(l.to)} />
                ) : (
                  <PillHash  key={l.to} hash={l.to} icon={l.icon} label={l.name} active={isHashActive(l.to)} onClick={goToHash} />
                )
              )}
            </ul>
</nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-2 text-white">
                <div className="isolate flex items-center gap-2 p-1 rounded-full bg-white/60 dark:bg-stone-900/60 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/40">
                  <LanguageSwitcher/>
                  <ThemeToggle />
                  <button
                    onClick={() => onSocialClick("Instagram")}
                    className="p-2 text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange dark:hover:text-amber-orange transition-colors"
                  >
                    <Instagram size={22} />
                  </button>
                  <button
                    onClick={onCallClick}
                    className="p-2 text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange dark:hover:text-amber-orange transition-colors"
                  >
                    <Phone size={22} />
                  </button>
                </div>
              <button
                onClick={() => navigate("/cart")}
                className="btn-primary ml-2 !px-6 !py-2.5 relative"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t("nav_order")}
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>

            {/* Burger + actions mobile */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={() => navigate("/cart")}
                className="text-chocolate-brown dark:text-soft-cream z-50 relative p-2"
                aria-label="Open cart"
              >
                <ShoppingCart size={28} />
                {count > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="text-chocolate-brown dark:text-soft-cream z-50 relative"
                aria-label="Open menu"
              >
                {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Wave */}
        {scrolled && (
          <NavWave className="pointer-events-none absolute mb-6 left-0 w-full h-6 md:h-10 text-soft-cream dark:text-dark-bg opacity-90 z-10" />
        )}
      </header>

      {/* Drawer mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-soft-cream dark:bg-dark-bg p-8 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full pt-20">
                <nav className="flex flex-col items-center justify-center flex-grow space-y-6">
                  {navLinks.map((l, i) =>
                    l.type === "route" ? (
                      <motion.div
                        key={l.to}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.07 + 0.2 }}
                        onClick={() => setIsOpen(false)}
                      >
                        <Link
                          to={l.to}
                          className="font-display text-chocolate-brown dark:text-soft-cream text-3xl flex items-center gap-3"
                        >
                          <l.icon className="size-6" />
                          {l.name}
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.button
                        key={l.to}
                        type="button"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.07 + 0.2 }}
                        onClick={() => goToHash(l.to)}
                        className="font-display text-chocolate-brown dark:text-soft-cream text-3xl flex items-center gap-3"
                      >
                        <l.icon className="size-6" />
                        {l.name}
                      </motion.button>
                    )
                  )}

                  <motion.button
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                      onOrderClick();
                      setIsOpen(false);
                    }}
                    className="btn-primary mt-6"
                  >
                    {t("nav_order")}
                  </motion.button>
                </nav>

                <div className="flex items-center justify-center space-x-6 pt-8">
                  <button
                    onClick={() => onSocialClick("Instagram")}
                    className="text-chocolate-brown dark:text-soft-cream hover:text-amber-orange transition-colors"
                  >
                    <Instagram size={32} />
                  </button>
                  <button
                    onClick={onCallClick}
                    className="text-chocolate-brown dark:text-soft-cream hover:text-amber-orange transition-colors"
                  >
                    <Phone size={32} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
