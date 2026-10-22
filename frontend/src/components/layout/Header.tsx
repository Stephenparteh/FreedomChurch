import { useEffect, useRef, useState, type FocusEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";
import nfpcCrest from "@/assets/brand/nfpc-crest-transparent.png";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryNav, siteConfig } from "@/data/site";
import { useApi } from "@/hooks/useApi";
import { getBranches } from "@/lib/api/resources";
import { cn } from "@/lib/cn";

/**
 * A solid white bar on every page. The active page is marked by a red underline
 * beneath its label, not by a background shape. Below the xl breakpoint, the
 * links move into a full-width sheet with large touch targets.
 *
 * Give remains part of the primary navigation, while Contact is the primary
 * action on the far right. "Branches" is inserted after Ministries; its label
 * never navigates on its own — visitors reach a branch only by picking one
 * from its dropdown (desktop, opens on hover or via the arrow) or submenu
 * (mobile, taps to expand/collapse), both of which only appear once at least
 * one branch is published.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileBranchesOpen, setMobileBranchesOpen] = useState(false);
  const { pathname } = useLocation();
  const branchesState = useApi(() => getBranches(), []);
  const branches = branchesState.status === "success" ? branchesState.data : [];

  // Close the mobile panel on route change, without an effect (React's
  // documented pattern for resetting state in response to a prop change).
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // The branches submenu only makes sense while the mobile panel is open.
  useEffect(() => {
    if (!open) setMobileBranchesOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep Give in the main navigation, but move Contact to the primary action.
  const desktopNav = primaryNav.filter((link) => link.to !== "/contact");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white">
      <Container className="flex h-16 items-center justify-between lg:h-24">
        <NavLink
          to="/"
          className="flex items-center gap-3.5"
          aria-label={`${siteConfig.name}, home`}
        >
          <img
            src={nfpcCrest}
            alt=""
            className="h-12 w-12 object-contain lg:h-16 lg:w-16"
          />

          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight text-text lg:text-2xl">
              {siteConfig.shortName}
            </span>

            <span className="mt-1.5 hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted sm:block">
              National Freedom Pentecostal
            </span>
          </span>
        </NavLink>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 xl:flex" aria-label="Primary">
          {desktopNav.map((link) => (
            <div key={link.to} className="contents">
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative py-2 text-sm font-medium text-text-muted transition-colors hover:text-text",
                    isActive &&
                      "text-text after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-accent-500 after:content-['']",
                  )
                }
              >
                {link.label}
              </NavLink>
              {link.to === "/ministries" && (
                <BranchesMenu branches={branches} isActive={pathname === "/branches"} />
              )}
            </div>
          ))}
        </nav>

        {/* Primary action */}
        <div className="hidden xl:block">
          <Button to="/contact" variant="primary" className="min-h-11 px-6">
            Contact
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-text hover:bg-surface-muted xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span aria-hidden className="relative block h-4 w-5">
            <span
              className={cn(
                "absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />

            <span
              className={cn(
                "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity duration-300",
                open ? "opacity-0" : "opacity-100",
              )}
            />

            <span
              className={cn(
                "absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </Container>

      {/* Mobile navigation */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={cn(
          "overflow-hidden border-t border-border bg-white transition-[max-height,opacity] duration-300 ease-out xl:hidden",
          open
            ? "max-h-[80vh] overflow-y-auto opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {desktopNav.map((link) => (
            <div key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-12 items-center border-l-2 border-transparent pl-3 font-display text-xl text-text-muted hover:text-text",
                    isActive && "border-accent-500 text-text",
                  )
                }
              >
                {link.label}
              </NavLink>
              {link.to === "/ministries" && (
                <div className="ml-3 border-l-2 border-transparent pl-3">
                  {branches.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setMobileBranchesOpen((v) => !v)}
                      aria-expanded={mobileBranchesOpen}
                      aria-controls="mobile-branches-submenu"
                      className="flex min-h-12 w-full items-center justify-between font-display text-xl text-text-muted hover:text-text"
                    >
                      Branches
                      <svg
                        aria-hidden
                        viewBox="0 0 12 8"
                        className={cn("h-2.5 w-3 shrink-0 transition-transform", mobileBranchesOpen && "rotate-180")}
                      >
                        <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : (
                    <span className="flex min-h-12 items-center font-display text-xl text-text-muted">
                      Branches
                    </span>
                  )}
                  {branches.length > 0 && mobileBranchesOpen && (
                    <ul id="mobile-branches-submenu" className="mb-1 ml-3 border-l-2 border-border pl-3">
                      {branches.map((branch) => (
                        <li key={branch.id}>
                          <NavLink
                            to={`/branches/${branch.slug}`}
                            className={({ isActive }) =>
                              cn(
                                "flex min-h-10 items-center text-base text-text-muted hover:text-text",
                                isActive && "text-text",
                              )
                            }
                          >
                            {branch.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}

          <Button to="/contact" variant="primary" className="mt-4 w-full">
            Contact
          </Button>
        </Container>
      </nav>
    </header>
  );
}

/**
 * Desktop "Branches" item: the label itself never navigates (there is no
 * single page it should take visitors to) — it only opens the dropdown on
 * hover, or via the arrow button on click/keyboard focus. Visitors reach a
 * branch only by clicking that branch's own item in the panel. The arrow
 * and panel only render once there's at least one branch to show; with none
 * published, the label is inert and clicking it does nothing. They close on
 * Escape, on losing focus entirely, or when the pointer and focus have both
 * left.
 */
function BranchesMenu({ branches, isActive }: { branches: { id: string; name: string; slug: string }[]; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasBranches = branches.length > 0;

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={() => hasBranches && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={handleBlur}
    >
      <span
        className={cn(
          "relative py-2 text-sm font-medium text-text-muted transition-colors",
          isActive &&
            "text-text after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-accent-500 after:content-['']",
        )}
      >
        Branches
      </span>

      {hasBranches && (
        <button
          type="button"
          aria-label="Show branches"
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center py-2 pl-1.5 text-text-muted transition-colors hover:text-text"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <svg aria-hidden viewBox="0 0 12 8" className={cn("h-2 w-2.5 transition-transform", open && "rotate-180")}>
            <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {hasBranches && (
        <div
          className={cn(
            "absolute left-0 top-full z-10 w-56 pt-3 transition-[opacity,transform] duration-150",
            open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
          )}
        >
          <ul className="overflow-hidden rounded-md border border-border bg-white py-2 shadow-elevated">
            {branches.map((branch) => (
              <li key={branch.id}>
                <NavLink
                  to={`/branches/${branch.slug}`}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text",
                      isActive && "text-primary-700",
                    )
                  }
                >
                  {branch.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
