import { useEffect, useRef, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollToId, scrollAfterClose } from "@/lib/scroll";

const LINKS = [
  { id: "uslugi", label: "Услуги" }, { id: "proekti", label: "Проекти" },
  { id: "za-men", label: "За мен" }, { id: "kontakti", label: "Контакти" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const mobile = useMediaQuery("(max-width: 1023px)");
  const destination = useRef(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { if (!mobile) setOpen(false); }, [mobile]);
  const go = (id) => {
    if (open) { destination.current = id; setOpen(false); }
    else scrollToId(id);
  };
  const openChat = () => {
    if (open) { destination.current = "chat"; setOpen(false); }
    else window.dispatchEvent(new CustomEvent("open-chat"));
  };
  const afterClose = (event) => {
    const next = destination.current;
    destination.current = null;
    if (!next) return;
    event.preventDefault();
    if (next === "chat") requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("open-chat")));
    else scrollAfterClose(next);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <header data-testid="site-header" className={`site-header fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled || open ? "bg-background/95 backdrop-blur-xl border-b border-border/80" : "bg-background/80 lg:bg-transparent"}`}>
        <nav aria-label="Основна навигация" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-2">
          <Logo />
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => <button key={link.id} data-testid={`nav-link-${link.id}`} onClick={() => go(link.id)} className="min-h-11 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full hover:bg-muted transition-colors">{link.label}</button>)}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <button data-testid="nav-ai-assistant-button" onClick={openChat} className="min-h-11 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground rounded-full border border-input hover:border-primary hover:text-primary transition-colors"><Sparkles className="w-4 h-4" />AI асистент</button>
            <button data-testid="nav-contact-cta" onClick={() => go("kontakti")} className="min-h-11 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover rounded-full transition-colors">Свържи се с мен</button>
          </div>
          <DialogTrigger asChild>
            <button data-testid="nav-mobile-toggle" className="lg:hidden w-11 h-11 shrink-0 flex items-center justify-center text-foreground hover:text-primary rounded-full transition-colors" aria-label="Отвори менюто"><Menu className="w-6 h-6" /></button>
          </DialogTrigger>
        </nav>
      </header>
      <DialogContent layout="custom" showCloseButton={false} data-testid="nav-mobile-menu" overlayTestId="nav-mobile-backdrop" aria-describedby={undefined} onCloseAutoFocus={afterClose} className="mobile-nav-panel flex flex-col border-border bg-background">
        <div className="flex items-center justify-between gap-4 px-5 py-3 shrink-0 border-b border-border">
          <DialogTitle>Навигация</DialogTitle>
          <DialogClose asChild><button data-testid="nav-mobile-close" aria-label="Затвори менюто" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5" /></button></DialogClose>
        </div>
        <div data-testid="nav-mobile-scroll" data-lenis-prevent className="overlay-scroll overflow-y-auto flex-1 min-h-0 px-4 py-4 flex flex-col gap-2">
          {LINKS.map((link) => <button key={link.id} data-testid={`nav-mobile-link-${link.id}`} onClick={() => go(link.id)} className="text-left min-h-12 px-4 py-3 rounded-xl text-base font-medium hover:bg-muted hover:text-primary transition-colors">{link.label}</button>)}
          <button data-testid="nav-mobile-ai-assistant" onClick={openChat} className="min-h-12 mt-2 flex items-center justify-center gap-2 px-4 py-3 border border-input rounded-full hover:text-primary transition-colors"><Sparkles className="w-4 h-4" />AI асистент</button>
          <button data-testid="nav-mobile-contact-cta" onClick={() => go("kontakti")} className="min-h-12 px-5 py-3 font-semibold text-primary-foreground bg-primary hover:bg-primary-hover rounded-full transition-colors">Свържи се с мен</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default Navbar;