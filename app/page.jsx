"use client";
import ProductCarousel from "@/components/product-carousel";
import ProductGrid from "@/components/product-grid";
import FalseColorGlitchImage from "@/components/FalseColorGlitchImage";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bold, Variable } from "lucide-react";
import { useRef, useState } from "react";
import "../styles/chain.css";
import "../styles/glitch.css";
import SignalBars from "@/components/SignalBars";
import {
  Sora,
  Poppins,
  Epilogue,
  Archivo,
  Lora,
  Manrope,
  Bebas_Neue,
  Michroma,
  Montserrat,
} from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"], // 🔥 important for bold look
});
const michroma = Michroma({
  subsets: ["latin"],
  weight: "400", // only one weight available
});
const products = [
  {
    id: "cap",
    name: "Cap",
    description:
      "A structured cap with clean paneling and subtle detailing. Designed to feel understated and functional.",

    media: [
      {
        type: "image",
        src: "/images/cap-1.png",
      },
      {
        type: "image",
        src: "/images/cap-2.png",
      },
      {
        type: "image",
        src: "/images/cap-3.png",
      },
    ],
  },

  {
    id: "shirt",
    name: "Shirt",
    description:
      "A relaxed-fit shirt built around minimal form. Quiet, neutral, and designed for everyday wear.",

    media: [
      {
        type: "image",
        src: "/images/shirt-1.jpg",
      },
      {
        type: "image",
        src: "/images/shirt-2.jpg",
      },
      {
        type: "image",
        src: "/images/shirt-3.jpg",
      },
    ],
  },

  {
    id: "jacket",
    name: "Jacket",
    description:
      "A lightweight jacket with sharp structure and a muted silhouette. Built for layering and longevity.",

    media: [
      {
        type: "image",
        src: "/images/jacket-1.jpg",
      },
      {
        type: "image",
        src: "/images/jacket-2.jpg",
      },
      {
        type: "image",
        src: "/images/jacket-3.jpg",
      },
    ],
  },

  {
    id: "tshirt-01",
    name: "T-Shirt 01",
    description:
      "An oversized T-shirt featuring a composed graphic. Designed to feel like a visual reference rather than a statement.",

    media: [
      {
        type: "image",
        src: "/images/tshirt-01-1.jpg",
      },
      {
        type: "image",
        src: "/images/tshirt-01-2.jpg",
      },
      {
        type: "image",
        src: "/images/tshirt-01-3.jpg",
      },
    ],
  },

  {
    id: "tshirt-02",
    name: "T-Shirt 02",
    description:
      "A soft cotton T-shirt with subtle contrast detailing. Minimal, calm, and intentionally understated.",

    media: [
      {
        type: "image",
        src: "/images/tshirt-02-1.jpg",
      },
      {
        type: "image",
        src: "/images/tshirt-02-2.jpg",
      },
      {
        type: "image",
        src: "/images/tshirt-02-3.jpg",
      },
    ],
  },

  {
    id: "tshirt-03",
    name: "T-Shirt 03",
    description:
      "A heavyweight T-shirt with a clean silhouette. Designed to sit outside fast trends.",

    media: [
      {
        type: "image",
        src: "/images/tshirt-03-1.jpg",
      },
      {
        type: "image",
        src: "/images/tshirt-03-2.jpg",
      },
      {
        type: "image",
        src: "/images/tshirt-03-3.jpg",
      },
    ],
  },
];

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400", // Bebas only has 1 weight
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const titleContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045, // controls letter delay
    },
  },
};

const titleLetter = {
  hidden: {
    y: 120,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1], // luxury easing
    },
  },
};

function ChainOverlay() {
  return (
    <>
      <div className="chain chain1">
        <img src="/images/chain.png" className="baseImg" alt="" />
        <img
          src="/images/chain.png"
          className="glowImg glowCore"
          alt=""
          aria-hidden="true"
        />
        <img
          src="/images/chain.png"
          className="glowImg glowBloom"
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="chain chain2">
        <img src="/images/chain.png" className="baseImg" alt="" />
        <img
          src="/images/chain.png"
          className="glowImg glowCore"
          alt=""
          aria-hidden="true"
        />
        <img
          src="/images/chain.png"
          className="glowImg glowBloom"
          alt=""
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function Scene({ background, height = "200vh", children, sectionRef }) {
  return (
    <section
      ref={sectionRef}
      style={{ ...styles.sceneSection, minHeight: height }}
    >
      <div
        style={{
          ...styles.sceneBackground,
          backgroundImage: `url('${background}')`,
        }}
      />
      <div style={styles.sceneContent}>{children}</div>
    </section>
  );
}

function ScrollScene({ background, height = "140vh", children }) {
  return (
    <section
      style={{
        ...styles.scrollSceneSection,
        minHeight: height,
        backgroundImage: `url('${background}')`,
      }}
    >
      <div style={styles.scrollSceneContent}>{children}</div>
    </section>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start 40%", "end start"],
  });

  const { scrollYProgress: heroScrolle } = useScroll({
    target: heroRef,
    offset: ["start", "end start"],
  });

  const { scrollYProgress: formScroll } = useScroll({
    target: heroRef,
    offset: ["start 0.5%", "end start"],
  });

  const { scrollYProgress: heroScrolly } = useScroll({
    target: heroRef,
    offset: ["start 0%", "end start"],
  });

  const logoWidth = useTransform(heroScrolly, [0, 0.05], ["280px", "50px"]);

  const logoY = useTransform(heroScrolly, [0, 0.05], ["370vh", "0px"]);

  const logoLeft = useTransform(
    heroScrolly,
    [0, 0.1], // FAST movement
    ["35rem", "20rem"], // START → END (more left)
  );

  // Logo scale from initial size (29rem) to final size (6rem) - ratio: 6/29 ≈ 0.207
  // Scales from 1 (full size) to 6/29 (final size) as you scroll
  const logoScale = useTransform(heroScroll, [0, 0.25], [1, 4.5 / 7]);
  const logoOpacity = useTransform(heroScroll, [0.2, 0.25], [0, 0.9]);

  //const logoScaleY = useTransform(formScroll, [0, 0.22], [1, 6 / 29]);
  const logoOpacityy = useTransform(heroScroll, [0, 0.42], [0, 1]);
  const logoFormX = useTransform(formScroll, [0, 0.22], ["10rem", "14.5rem"]);

  // Header opacity control
  const headerOpacity = useTransform(
    heroScroll,
    [0.15, 0.65, 0.7],
    [0, 20, 40],
  );

  const heroParagraphColor = useTransform(
    scrollYProgress,
    [0.7, 0.73], // adjust if needed
    ["#ffffff", "#0a0a0a"],
  );

  const heroLogoOpacity = useTransform(heroScrolle, [0, 0.22], [1, 0]);
  const logoScalep = useTransform(heroScroll, [0, 0.35], [1, 20 / 29]);

  const scale = useTransform(scrollYProgress, [0, 0.25], [1.35, 1]);
  const y = useTransform(scrollYProgress, [0, 0.25], [140, 0]);
  const x = useTransform(scrollYProgress, [0, 0.25], ["20%", "0%"]);
  const lineHeight = useTransform(scrollYProgress, [0, 0.15], ["0.95", "0.8"]);
  const titleSpace = useTransform(
    scrollYProgress,
    [0, 0.15],
    ["420px", "200px"],
  );

  const [activeProduct, setActiveProduct] = useState(products[0]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const activeMedia = activeProduct.media[activeMediaIndex];
  const goPrev = () => {
    setActiveMediaIndex((prev) =>
      prev === 0 ? activeProduct.media.length - 1 : prev - 1,
    );
  };

  const goNext = () => {
    setActiveMediaIndex((prev) =>
      prev === activeProduct.media.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <motion.img
        src="/images/logo.png"
        alt="Logo"
        style={{
          top: 0,
          position: "fixed",
          left: "34rem",
          top: "0px", // START position (hero area)
          width: "420px", // BIG size
          zIndex: 50,
          y: logoY,

          width: logoWidth,
          left: logoLeft,
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={{ height: "0.5px" }} />

        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "48px",
            zIndex: 20,
            backgroundColor: "transparent",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            opacity: headerOpacity,
            display: "flex",
            alignItems: "center",

            pointerEvents: "none",
          }}
        >
          <motion.div
            style={{
              position: "fixed",
              left: "6rem",
              top: "4%",
              y: "-50%",
              fontFamily: "Galgo",
              fontSize: "7rem",
              letterSpacing: "0.26rem",
              color: "#fcf4f4",
              fontWeight: 600,
              opacity: logoOpacity,
              scale: logoScale,
              transformOrigin: "left center",
              whiteSpace: "nowrap",
            }}
          >
            COMMON
          </motion.div>
          <motion.div
            style={{
              position: "fixed",
              left: logoFormX,
              top: "4%",
              y: "-50%",
              fontFamily: "Galgo",
              fontSize: "4.5rem",
              letterSpacing: "0.18rem",
              color: "#fcf4f4",
              opacity: logoOpacityy,
              fontWeight: 700,
              //scale: logoScaleY,
              transformOrigin: "left center",
              whiteSpace: "nowrap",
            }}
          >
            FORM
          </motion.div>
        </motion.div>

        <div style={styles.headerInner}>
          {/* Left */}
          <div style={styles.headerLeft}>
            <span style={styles.headerBrand}>COMMON FORM</span>
          </div>

          {/* Center */}
          <nav style={styles.headerNav}>
            <a style={styles.headerLink}>Home</a>
            <a style={styles.headerLink}>Collection</a>
            <a style={styles.headerLink}>About</a>
            <a style={styles.headerLink}>Contact</a>
          </nav>

          {/* Right */}
          <div style={styles.headerRight}>
            <span style={styles.headerMeta}>© 2026</span>
          </div>
        </div>
      </header>

      <motion.main
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "visible",
        }}
      >
        <ChainOverlay />

        <Scene
          sectionRef={heroRef}
          background="/images/background.jpg"
          height="200vh"
        >
          <div className="scene-image-wrapper">
            <div className="scene-image-sticky">
              <FalseColorGlitchImage
                src="/images/scene1.png"
                alt=""
                imageClassName="scene-image scene-image-1"
                intervalMs={5000}
                durationMs={500}
                jitterMs={1100}
              />
            </div>
          </div>
          <div style={styles.heroSection}>
            <div style={styles.heroInner}>
              {/* LEFT TEXT */}
              <div style={styles.heroText}>
                <motion.h1
                  style={{
                    ...styles.heroTitle,
                    lineHeight,

                    opacity: heroLogoOpacity,
                  }}
                  variants={titleContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div>
                    <motion.div
                      style={{
                        scale: logoScalep,
                        transformOrigin: "left center",
                        marginTop: "-7.5rem",
                      }}
                    >
                      <span
                        className="common-text glitch-text textured"
                        data-text="COMMON"
                      >
                        COMMON
                      </span>
                    </motion.div>

                    <motion.div
                      div
                      className="form-wrapper glitch-text textured"
                      data-text="FORM"
                      style={{
                        scale: logoScalep,
                        transformOrigin: "left center",
                        marginTop: "-8.5rem",
                      }}
                    >
                      FORM
                    </motion.div>
                  </motion.div>
                </motion.h1>

                <motion.p
                  style={{
                    ...styles.heroLine,
                    color: heroParagraphColor,
                  }}
                >
                  A STRUCTURE DISGUISED AS CLOTHING
                </motion.p>
                <motion.p
                  style={{ ...styles.heroLine2, color: heroParagraphColor }}
                >
                  COMMON FORM builds beneath IDENTITY — beyond PERFORMANCE,
                  where SIGNAL fades and STRUCTURE remains. EXCESS removed,
                  DISTORTION silenced — only BALANCE, CLARITY, FORM.
                </motion.p>
                <motion.p
                  style={{ ...styles.heroLine3, color: heroParagraphColor }}
                >
                  Common Form is built around the human body — how it moves,
                  pauses, and exists within space. Clothing is treated as a
                  quiet extension of form rather than a statement, shaped
                  through proportion, weight, and restraint. Each piece follows
                  the natural rhythm of the body, allowing fabric to settle,
                  drape, and respond without force or excess. The focus is not
                  on trend or decoration, but on presence, balance, and
                  longevity, creating garments that feel intentional, lived-in,
                  and quietly timeless.
                </motion.p>
                <motion.p
                  style={{ ...styles.heroLine, color: heroParagraphColor }}
                >
                  Quiet cevkjejveonstruction
                </motion.p>

                <motion.img
                  src="/images/back1.png"
                  alt=""
                  style={{
                    paddingLeft: "6rem",
                    width: "800px", // adjust size
                    marginTop: "1rem",
                  }}
                />
              </div>

              {/* RIGHT IMAGE */}
              <div style={styles.heroImageWrapper}>
                <img src="/images/hero.png" alt="Hero" style={styles.heroImg} />
              </div>
            </div>
          </div>
        </Scene>

        {/* Main Content */}
        <Scene
          sectionRef={scene2Ref}
          background="/images/bg2.jpg"
          height="200vh"
        >
          <div className="scene-image-wrapper">
            <div className="scene-image-sticky">
              <FalseColorGlitchImage
                src="/images/scene2.png"
                alt=""
                imageClassName="scene-image scene-image-2"
                intervalMs={6000}
                durationMs={200}
                jitterMs={1100}
              />
              <div className="scene2-ticker-sticky">
                <div className="ticker">
                  <div className="ticker-track">
                    <p>COMMON FORM</p>
                    <p>COMMON FORM</p>
                    <p>COMMON FORM</p>
                    <p>COMMON FORM</p>
                    <p>COMMON FORM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="scene2-text-container">
            <p className="scene2-line scene2-line-1">FORM VARSITY</p>

            <p className="scene2-line scene2-line-2">BUILT ON STRUCTURE</p>

            <div className="scene2-style-note">
              <img
                src="/images/scene2back.png"
                alt="style visual"
                className="scene2-style-image"
              />
            </div>

            <p className="scene2-line scene2-line-3">
              Structured jackets with defined presence.
              <br />
              Relaxed trousers with controlled fall.
              <br />
              Designed to move naturally — without losing form.
            </p>

            <p className="scene2-line scene2-line-4">
              This collection is built on control.
              <br />
              Defined silhouettes, measured weight, and intentional
              construction.
              <br />
              Varsity jackets bring presence. Trousers bring flow.
              <br />
              Together, they create a uniform that feels effortless but precise.
            </p>
          </div>
        </Scene>

        <Scene
          sectionRef={scene3Ref}
          background="/images/bg3.jpg"
          height="200vh"
        >
          <div className="scene-image-wrapper">
            <div className="scene-image-sticky">
              <FalseColorGlitchImage
                src="/images/scene3a.png"
                alt=""
                imageClassName="scene-image scene-image-3a"
                intervalMs={4000}
                durationMs={600}
                jitterMs={1100}
              />

              <img
                src="/images/scene3b.png"
                className="scene-image scene-image-3b"
                alt=""
              />
            </div>
          </div>
        </Scene>

        <ScrollScene background="/images/background.jpg" height="140vh">
          <div style={styles.siteSection}>
            <div style={styles.container}>
              {/* Left - Description */}
              <div style={styles.descriptionSection}>
                <p style={styles.description}>{activeProduct.description}</p>
              </div>

              {/* Center - Product media */}
              <div style={styles.carouselSection}>
                {/* MAIN VIEW */}
                <div style={styles.viewerWrapper}>
                  <button style={styles.arrowLeft} onClick={goPrev}>
                    ‹
                  </button>

                  <img
                    src={activeMedia.src}
                    alt={activeProduct.name}
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "contain",
                    }}
                  />

                  <button style={styles.arrowRight} onClick={goNext}>
                    ›
                  </button>
                </div>

                {/* THUMBNAIL SLIDER */}
                <div style={styles.thumbnailRow}>
                  {activeProduct.media.map((media, index) => {
                    const isActive = index === activeMediaIndex;

                    return (
                      <div
                        key={index}
                        onClick={() => setActiveMediaIndex(index)}
                        style={{
                          ...styles.thumbnail,
                          borderColor: isActive ? "#fbbf24" : "#262626",
                        }}
                      >
                        <img
                          src={media.src}
                          alt=""
                          style={styles.thumbnailImage}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right - Grid and Title */}
              <div style={styles.rightSection}>
                <h2 style={styles.dropTitle}>DROP 01</h2>
                <ProductGrid
                  products={products}
                  activeProduct={activeProduct}
                  onSelect={(product) => {
                    setActiveProduct(product);
                    setActiveMediaIndex(0);
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollScene>
      </motion.main>
    </>
  );
}

const styles = {
  main: {
    minHeight: "100vh",

    color: "white",
    fontFamily: '"Geist", "Geist Fallback", sans-serif',
  },
  header: {
    borderBottom: "none",
    padding: "0.25rem 1.5rem",
    backgroundColor: "transparent",
  },
  headerInner: {
    padding: "0.1rem 3rem",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    backgroundColor: "transparent",
    lineHeight: "1rem",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  headerBrand: {
    fontSize: "0.7rem",
    letterSpacing: "0.35em",
    color: "#ffffff",
    opacity: 0.85,
  },
  headerNav: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
  },
  headerLink: {
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#ffffff",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  headerRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  headerMeta: {
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    color: "#6b6b6b",
  },
  container: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "4rem 1.5rem",
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1fr",
    gap: "3rem",
    alignItems: "center",
  },
  descriptionSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    textAlign: "center",
  },
  description: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#d1d5db",
    margin: 0,
  },
  carouselSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  rightSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  dropTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: 0,
    color: "white",
    textAlign: "center",
  },
  thumbnailRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "24px",
  },

  thumbnail: {
    width: "64px",
    height: "64px",
    borderRadius: "6px",
    border: "2px solid #333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
    overflow: "hidden",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  viewerWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowLeft: {
    position: "absolute",
    left: "-40px",
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: "48px",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },

  arrowRight: {
    position: "absolute",
    right: "-40px",
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: "48px",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  sceneSection: {
    position: "relative",
    minHeight: "200vh",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
  },
  sceneBackground: {
    gridArea: "1 / 1",
    alignSelf: "start",
    position: "sticky",
    top: 0,
    zIndex: 0,
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    pointerEvents: "none",
  },
  sceneContent: {
    gridArea: "1 / 1",
    position: "relative",
    zIndex: 2,
  },
  scrollSceneSection: {
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  scrollSceneContent: {
    position: "relative",
    width: "100%",
    minHeight: "100%",
  },
  heroSection: {
    paddingTop: "0rem",
    minHeight: "200vh", // gives scroll room
    position: "relative",
    zIndex: 1,
    overflow: "visible", // Allow content to overflow
  },

  heroInner: {
    margin: "0",
    padding: "4rem 0rem",
    display: "grid",
    overflow: "visible",
    gridTemplateColumns: "1fr 1.6fr", // Increased image column size
    gap: "6rem", // Increased gap to prevent overlap
    // image stays visible while scrolling
    alignItems: "flex-start",
  },

  heroTitle: {
    paddingTop: "0",
    letterSpacing: "0.5rem",
    fontSize: "29rem",
    fontFamily: "Galgo",
    lineHeight: "0.2",
    paddingLeft: "6rem",
    margin: 0,
    color: "#fcf4f4",
    whiteSpace: "nowrap",
    overflow: "visible",
  },
  heroText: {
    fontSize: "18rem",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    paddingBottom: "12rem",
  },

  heroImageWrapper: {
    position: "sticky",
    top: "10vh",
    height: "140vh", // controls visible scale
    display: "flex",
    overflow: "visible", // Allow overflow on both sides
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },

  heroImg: {
    height: "104vh", // Reduced height to prevent overlap
    maxWidth: "none", // VERY IMPORTANT
    objectFit: "contain", // Changed from "cover" to allow full image visibility
    position: "absolute",
    right: 0, // Align right edge with wrapper
    top: 0,
    // Shift left to create overflow
  },

  heroLine: {
    fontFamily: bebas.style.fontFamily,
    paddingLeft: "6rem",
    fontWeight: 500,
    /*letterSpacing: "0.1rem",*/
    fontSize: "5rem",
    maxWidth: "1090px",
    lineHeight: "1",
    fontWeight: 400,
    color: "#cfcfcf",
  },
  heroLine2: {
    fontFamily: poppins.style.fontFamily,
    paddingLeft: "6rem",

    paddingRight: "300px",
    letterSpacing: "0.5rem",
    fontSize: "1rem",
    fontWeight: 400,
    maxWidth: "1090px",
    lineHeight: "1",
    color: "#cfcfcf",
  },
  heroLine3: {
    fontFamily: bebas.style.fontFamily,
    paddingLeft: "6rem",
    fontWeight: 100,
    fontSize: "0.77rem",
    letterSpacing: "0.2rem",
    maxWidth: "1090px",
    lineHeight: "1",
    color: "#cfcfcf",
  },

  siteSection: {
    paddingTop: "6rem",
  },

  commonText: {
    fontSize: "29rem",
    lineHeight: 0.9,
    display: "block",
  },
};
