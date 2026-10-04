import { useRef } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PortfolioImage } from "@/components/PortfolioImage";
import { scrollAfterClose } from "@/lib/scroll";

export const ProjectDialog = ({ project, onClose, returnFocusRef }) => {
  const contactRequested = useRef(false);
  return (
    <Dialog open={Boolean(project)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent data-testid="project-modal" overlayTestId="project-modal-backdrop" showCloseButton={false}
        className="project-dialog w-[calc(100%-2rem)] max-w-lg flex flex-col gap-0 p-0 rounded-2xl sm:rounded-3xl bg-card overflow-hidden"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (contactRequested.current) { contactRequested.current = false; scrollAfterClose("kontakti"); }
          else returnFocusRef.current?.focus({ preventScroll: true });
        }}>
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border shrink-0">
          <DialogTitle data-testid="project-modal-title" className="min-w-0 text-base sm:text-lg">{project?.title}</DialogTitle>
          <DialogClose asChild><button data-testid="project-modal-close-button" aria-label="Затвори проекта" className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center hover:bg-muted hover:text-primary transition-colors"><X className="w-5 h-5" /></button></DialogClose>
        </div>
        <div data-testid="project-modal-scroll" data-lenis-prevent className="overlay-scroll min-h-0 overflow-y-auto">
          {project && <>
            <div className="aspect-[16/9] overflow-hidden">
              <PortfolioImage src={project.img} alt={project.title} sizes="(max-width: 544px) calc(100vw - 2rem), 512px" className="w-full h-full object-cover" loading="eager" />
            </div>
            <div className="p-5 sm:p-6">
              <p className="font-mono-label text-xs uppercase text-primary">{project.cat}</p>
              <DialogDescription data-testid="project-modal-description" className="mt-3 text-base leading-relaxed">{project.desc}</DialogDescription>
              <div className="mt-4 flex flex-wrap gap-2">{project.tech.map((tech) => <span key={tech} className="text-xs font-semibold bg-muted rounded-full px-3 py-1.5">{tech}</span>)}</div>
            </div>
          </>}
        </div>
        <div className="p-4 border-t border-border shrink-0">
          <button data-testid="project-modal-cta" onClick={() => { contactRequested.current = true; onClose(); }} className="min-h-12 w-full px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover transition-colors">Поискай подобен проект</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};