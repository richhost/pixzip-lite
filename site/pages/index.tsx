import Head from "next/head";

import Showcase from "~/components/Showcase";
import Hero from "~/components/Hero";
import Intro from "~/components/Intro";
import OpenSource from "~/components/OpenSource";
import Footer from "~/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>像素丢失 - 面向现代 Web 应用的开源图片压缩软件</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="author" content="Abiee" />
        <meta
          name="description"
          content="面向现代 Web 应用的开源图片压缩软件"
        />
        <meta
          name="keywords"
          content="像素丢失,像素丢失下载,图片压缩,avif,webp,开源图片压缩软件"
        />
        <meta property="og:title" content="像素丢失" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xiangsu.art/ogp.png" />
        <meta property="og:url" content="https://xiangsu.art" />
        <meta
          property="og:description"
          content="面向现代 Web 应用的开源图片压缩软件"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="https://xiangsu.art/ogp.png" />
        <meta property="twitter:title" content="像素丢失" />
        <meta
          property="twitter:description"
          content="面向现代 Web 应用的开源图片压缩软件"
        />
      </Head>
      <main className={"container"}>
        <Hero />
        <Intro />
        <Showcase />
        <OpenSource />
        <Footer />
      </main>
    </>
  );
}
