import TopNav from "@/layouts/TopNav";
import { Footer } from "@/layouts/Footer";
import Main from "@/layouts/Main";

export default function Home() {
  console.log("rendering home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background from-25% via-secondary via-50% to-card to-80% relative w-full">
      <TopNav />
      <Main />
      <Footer />
    </div>
  );
}
