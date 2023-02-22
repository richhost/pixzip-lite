import Hero from "~/components/Hero";
import Intro from "~/components/Intro";
import Showcase from "~/components/Showcase";
import OpenSource from "~/components/OpenSource";
import Footer from "~/components/Footer";

export default function Home() {
  return (
    <>
      <main className="container">
        <Hero />
        <Intro />
        <Showcase />
        <OpenSource />
        <Footer />
      </main>
    </>
  );
}
