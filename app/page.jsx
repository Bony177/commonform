"use client";
import ProductCarousel from "@/components/product-carousel";
import ProductGrid from "@/components/product-grid";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bold, Variable } from "lucide-react";
import { useRef, useState } from "react";

const products = [
  {
    id: "cap",
    name: "Cap",
    description:
      "A structured cap with clean paneling and subtle detailing. Designed to feel understated and functional.",

    media: [
      {
        type: "model",
        src: "/models/cap.glb",
      },
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
        type: "model",
        src: "/models/shirt.glb",
      },
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
        type: "model",
        src: "/models/jacket.glb",
      },
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
        type: "model",
        src: "/models/tshirt-01.glb",
      },
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
        type: "model",
        src: "/models/tshirt-02.glb",
      },
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
        type: "model",
        src: "/models/tshirt-03.glb",
      },
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

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
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

  const bgColor = useTransform(
    scrollYProgress,
    [0.7, 0.8],
    ["rgba(10,10,10,0)", "rgba(255,255,255,0.95)"],
  );

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
      <div
        style={{
          position: "fixed",
          left: "59rem",
          top: "10vh",
          width: "420px",
          height: "620px",
          zIndex: 50,
          pointerEvents: "none",
          isolation: "isolate", // important
        }}
      >
        <model-viewer
          src="/3d/guy.glb"
          auto-rotate
          rotation-per-second="15deg"
          camera-controls={false}
          disable-zoom
          style={{
            width: "100%",
            height: "100%",
            display: "block", // VERY IMPORTANT
          }}
        />
      </div>

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
            backgroundColor: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
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
              top: "50%",
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
              top: "50%",
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

      <motion.main style={{ backgroundColor: bgColor }}>
        {/* HERO SECTION */}
        <section ref={heroRef} style={styles.heroSection}>
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
                <motion.div ref={heroRef}>
                  <motion.div
                    style={{
                      scale: logoScalep,
                      transformOrigin: "left center",
                      marginTop: "-7.5rem",
                    }}
                  >
                    <span className="common-text">COMMON</span>
                  </motion.div>

                  <motion.div
                    className="form-wrapper"
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
                AN INDEPENDENT ART & CLOTHING PROJECT
              </motion.p>
              <motion.p
                style={{ ...styles.heroLine2, color: heroParagraphColor }}
              >
                COMMON FORM MAKES CLOTHING FOR THE HUMAN BODY. IT BEGINS WHERE
                SKIN BEGINS. THERE IS NO PERFORMANCE, NO EXCESS. ONLY FORM,
                REDUCED TO WHAT MATTERS.
              </motion.p>
              <motion.p
                style={{ ...styles.heroLine3, color: heroParagraphColor }}
              >
                COMMON FORM IS BUILT AROUND THE HUMAN BODY — HOW IT MOVES,
                RESTS, AND EXISTS IN SPACE. CLOTHING IS APPROACHED AS A QUIET
                EXTENSION OF FORM RATHER THAN A STATEMENT, SHAPED BY PROPORTION,
                WEIGHT, AND RESTRAINT. EACH PIECE IS DESIGNED TO FOLLOW THE
                NATURAL LANGUAGE OF THE BODY, ALLOWING FABRIC TO SIT, FALL, AND
                INTERACT WITHOUT FORCE OR EXCESS. THE FOCUS IS NOT ON TREND OR
                DECORATION, BUT ON PRESENCE, BALANCE, AND LONGEVITY, CREATING
                GARMENTS THAT FEEL CONSIDERED, LIVED IN, AND TIMELESS.
              </motion.p>
              <motion.p
                style={{ ...styles.heroLine, color: heroParagraphColor }}
              >
                Quiet cevkjejveonstruction
              </motion.p>

              <motion.p
                style={{ ...styles.heroLine, color: heroParagraphColor }}
              >
                Intendedevoevoenvon to remain
              </motion.p>
            </div>

            {/* RIGHT IMAGE */}
            <div style={styles.heroImageWrapper}>
              <img src="/images/hero.png" alt="Hero" style={styles.heroImg} />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section style={styles.siteSection}>
          <div style={styles.container}>
            {/* Left - Description */}
            <div style={styles.descriptionSection}>
              <p style={styles.description}>{activeProduct.description}</p>
            </div>

            {/* Center - 3D T-shirt */}
            <div style={styles.carouselSection}>
              {/* MAIN VIEW */}
              <div style={styles.viewerWrapper}>
                <button style={styles.arrowLeft} onClick={goPrev}>
                  ‹
                </button>

                {activeMedia.type === "model" ? (
                  <model-viewer
                    src={activeMedia.src}
                    auto-rotate
                    camera-controls
                    disable-zoom
                    style={{ width: "100%", height: "500px" }}
                  />
                ) : (
                  <img
                    src={activeMedia.src}
                    alt={activeProduct.name}
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "contain",
                    }}
                  />
                )}

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
                      {media.type === "image" ? (
                        <img
                          src={media.src}
                          alt=""
                          style={styles.thumbnailImage}
                        />
                      ) : (
                        <span style={styles.modelLabel}>3D</span>
                      )}
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
        </section>
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
    borderBottom: "1px solid #262626",
    padding: "0.25rem 1.5rem",
    backgroundColor: "#0a0a0a",
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

  modelLabel: {
    fontSize: "12px",
    letterSpacing: "2px",
    color: "#fbbf24",
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
  heroSection: {
    paddingTop: "0rem",
    minHeight: "200vh", // gives scroll room
    position: "relative",
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
    fontFamily: "Galgo",
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
    paddingLeft: "6rem",
    fontWeight: 500,
    letterSpacing: "0.2rem",
    fontSize: "5rem",
    maxWidth: "1090px",
    lineHeight: "0.5",
    fontWeight: 500,
    color: "#cfcfcf",
  },
  heroLine2: {
    paddingLeft: "6rem",
    paddingRight: "400px",
    letterSpacing: "0.1rem",
    fontSize: "2.8rem",
    fontWeight: 100,
    maxWidth: "1090px",
    lineHeight: "1",
    color: "#cfcfcf",
  },
  heroLine3: {
    paddingLeft: "6rem",
    fontWeight: 100,
    fontSize: "2rem",
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
