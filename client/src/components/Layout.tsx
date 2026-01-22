import { Link, useLocation } from "wouter";
import { Circle, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Browse Circles", href: "/" },
    { label: "Start a Circle", href: "/create" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-primary rounded-full group-hover:bg-primary/90 transition-colors">
                <Circle className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-2xl font-bold text-primary tracking-tight">
                Temple Circles
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    location === item.href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background">
                  <div className="flex flex-col space-y-6 mt-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-lg font-medium ${
                          location === item.href ? "text-primary" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary py-12 text-primary-foreground mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-6 opacity-80">
            <Circle className="h-5 w-5" />
            <span className="font-heading font-bold text-xl">Temple Circles</span>
          </div>
          <p className="text-primary-foreground/60 text-sm max-w-md mx-auto">
            Connecting our community through shared interests, study, and fellowship.
            Join a circle today and find your place.
          </p>
          <div className="mt-8 border-t border-primary-foreground/10 pt-8 text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Temple Circles. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
