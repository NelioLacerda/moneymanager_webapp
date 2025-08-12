import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PT, GB } from 'country-flag-icons/react/3x2'

export default function LanguageSwitcher({ className = "" }) {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const current = (i18n.language || "en").slice(0,2).toLowerCase();

    const changeLang = (lng) => {
        i18n.changeLanguage(lng);
        try { localStorage.setItem("i18nextLng", lng); } catch(e) {}
        setOpen(false);
    };

    return (
        <div ref={ref} className={`fixed bottom-4 right-4 z-50 ${className}`}>
            <div className="relative">
                <button
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen(v => !v)}
                    className="hover:cursor-pointer w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center font-semibold text-sm transition-transform transform hover:scale-105"
                    title="Change language"
                >
                    {current === "pt" ? (
                        <PT className="w-6 h-4" title="Portugal" />
                    ) : (
                        <GB className="w-6 h-4" title="United Kingdom" />
                    )}
                </button>

                <div
                    className={`origin-bottom-right absolute bottom-16 right-0 flex flex-col gap-2 items-end
                      transition-all duration-200 ${open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}
                >
                    <button
                        onClick={() => changeLang("pt")}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white shadow hover:bg-slate-50 text-sm w-28 justify-end hover:cursor-pointer"
                    >
                        <PT className="w-5 h-3" />
                        <span>PT</span>
                    </button>

                    <button
                        onClick={() => changeLang("en")}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white shadow hover:bg-slate-50 text-sm w-28 justify-end hover:cursor-pointer"
                    >
                        <GB className="w-5 h-3" />
                        <span>EN</span>
                    </button>
                </div>
            </div>
        </div>
    );
}