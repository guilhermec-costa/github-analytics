export default function DashboardAnchors() {
  return (
    <div className="flex flex-col space-y-2 items-start text-sm text-muted-foreground">
      <a
        href="#repository-languages"
        className="hover:text-foreground transition-colors"
      >
        Repository Languages
      </a>
      <hr className="w-full border-t border-border" />
      <a
        href="#repository-languages"
        className="hover:text-foreground transition-colors"
      >
        Commits
      </a>
      <hr className="w-full border-t border-border" />
    </div>
  );
}
