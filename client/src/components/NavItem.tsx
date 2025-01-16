interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

export default function NavItem({ href, children }: NavItemProps) {
  return (
    <a
      href={href}
      className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
    </a>
  );
}
