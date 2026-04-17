"use client";
import ProductCarousel from "@/components/product-carousel";
import ProductGrid from "@/components/product-grid";
import AutoRotateModelViewer from "@/components/AutoRotateModelViewer";
import FalseColorGlitchImage from "@/components/FalseColorGlitchImage";
import ThermalGlitchImage from "@/components/ThermalGlitchImage";
import TextScramble from "@/components/TextScramble";
import FireflyLayer from "@/components/FireFlyLayout";
import LightLayer from "@/components/LightLayer";
import LiquidBackground from "@/components/LiquidBackround";
import LiquidBackgroundRed from "@/components/LiquidBackgroundRed";
import HalftoneFilter from "@/components/HalftoneFilter";
import Scene2CompositeEffect from "@/components/Scene2CompositeEffect";

import { motion, useScroll, useTransform } from "framer-motion";
import { Bold, Variable } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/chain.css";
import "../styles/glitch.css";
import "@/components/LiquidBckground.css";
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
const modelPaths = [
  "/3d/jacket red.glb",
  "/3d/black varsity jacket 3d model (1).glb",
  "/3d/racing jacket 3d model.glb",
  "/3d/orange.glb",
  "/3d/black sneaker 3d model.glb",
  "/3d/combat boot 3d model.glb",
];

const products = [
  {
    id: "cap",
    name: "VELOCITY FORM JACKET-RED",
    price: "$59",
    description:
      "Built around motion and intent, the Velocity Form Jacket is not just a garment but a statement of forward energy. Defined by sharp paneling and high-contrast detailing, it carries a sense of speed even at rest.Crafted using a blend of high-density synthetic leather and reinforced textile panels, the jacket balances durability with flexibility.",

    media: [
      {
        type: "image",
        src: "/images/jacket red 1.png",
      },
      {
        type: "image",
        src: "/images/jacketred2.png",
      },
      {
        type: "image",
        src: "/images/jacketred3.png",
      },
    ],
  },

  {
    id: "shirt",
    name: "FORM PULSE-BLACK",
    price: "$74",
    description:
      "FORM PULSE: Pulse exists in stillness, yet carries an underlying intensity. Rooted in minimalism, it strips away distraction and focuses on balance, proportion, and quiet presence. The design language is restrained — dark tones, subtle text, and structured geometry — creating a piece that feels grounded and deliberate.Constructed from premium-grade composite fabric with a soft internal lining,",

    media: [
      {
        type: "image",
        src: "/images/black varsity jacket 1.png",
      },
      {
        type: "image",
        src: "/images/black varsity jacket 2.png",
      },
      {
        type: "image",
        src: "/images/black varsity jacket 3.png",
      },
    ],
  },

  {
    id: "jacket",
    name: "VELOCITY FORM JACKET-GREEN",
    price: "$129",
    description:
      "Built around motion and intent, the Velocity Form Jacket is not just a garment but a statement of forward energy. Defined by sharp paneling and high-contrast detailing, it carries a sense of speed even at rest.Crafted using a blend of high-density synthetic leather and reinforced textile panels, the jacket balances durability with flexibility.",

    media: [
      {
        type: "image",
        src: "/images/leather racing jacket 1.png",
      },
      {
        type: "image",
        src: "/images/leather racing jacket 2.png",
      },
      {
        type: "image",
        src: "/images/leather racing jacket 3.png",
      },
    ],
  },

  {
    id: "tshirt-01",
    name: "FORM GRIDLINE ORANGE",
    price: "$49",
    description:
      "FORM GRIDLINE: Gridline is built on structure — a visual and conceptual mapping of order within chaos. The design takes inspiration from grids, coordinates, and controlled systems, translating them into layered panels and segmented detailing. The contrast of tones and directional elements creates a sense of movement guided by logic The jacket is constructed using a hybrid of performance fabric and coated material,",

    media: [
      {
        type: "image",
        src: "/images/orange1.png",
      },
      {
        type: "image",
        src: "/images/orange2.png",
      },
      {
        type: "image",
        src: "/images/orange3.png",
      },
    ],
  },

  {
    id: "tshirt-02",
    name: "CF-AXIS/01",
    price: "$52",
    description:
      "CF-AXIS/01 is built on the idea that structure should not compete with expression, but quietly enable it.",

    media: [
      {
        type: "image",
        src: "/images/black sneakers 1.png",
      },
      {
        type: "image",
        src: "/images/black sneakers 2.png",
      },
      {
        type: "image",
        src: "/images/black sneakers 3.png",
      },
    ],
  },

  {
    id: "tshirt-03",
    name: "CF-GRND",
    price: "$54",
    description:
      "CF-GRND is built as an extension of structure rather than decoration — a form that exists in balance with movement, weight, and space. The silhouette follows a controlled geometry, where each panel, seam, and material transition is placed with intention, allowing the shoe to feel both grounded and adaptive. There is no excess, no unnecessary noise",

    media: [
      {
        type: "image",
        src: "/images/combat boot 1.png",
      },
      {
        type: "image",
        src: "/images/combat boot 2.png",
      },
      {
        type: "image",
        src: "/images/combat boot 3.png",
      },
    ],
  },
].map((product, index) => ({
  ...product,
  media: [
    {
      type: "model",
      src: modelPaths[index] ?? modelPaths[0],
    },
    ...product.media,
  ],
}));

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
    transition: {},
  },
};

const titleLetter = {
  hidden: {
    y: "120%",
    opacity: 0,
  },
  visible: (index = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0.12 + index * 0.04,
      ease: [0.22, 1, 0.36, 1], // luxury easing
    },
  }),
};

function StaggeredHeadingWord({ word, className, startIndex = 0 }) {
  return (
    <span className={className} aria-label={word}>
      {Array.from(word).map((char, index) => (
        <span
          key={`${word}-${index}`}
          className="hero-title-letter-mask"
          aria-hidden="true"
        >
          <motion.span
            className="hero-title-letter glitch-text"
            data-text={char}
            variants={titleLetter}
            custom={startIndex + index}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const HERO_COPY_SCROLL_DEFAULTS = {
  start: 0.02,
  end: 0.24,
  stagger: 0.09,
  fromOpacity: 0,
  fromY: 60,
  fromScale: 0.5,
};

const HERO_MANIFESTO_LINE_1 = "A STRUCTURE DISGUISED AS CLOTHING";
const HERO_MANIFESTO_LINE_2 =
  "COMMON FORM builds beneath IDENTITY - beyond PERFORMANCE, where SIGNAL fades and STRUCTURE remains. EXCESS removed, DISTORTION silenced - only BALANCE, CLARITY, FORM.";
const HERO_MANIFESTO_LINE_3 =
  "Common Form is built around the human body - how it moves, pauses, and exists within space. Clothing is treated as a quiet extension of form rather than a statement, shaped through proportion, weight, and restraint. Each piece follows the natural rhythm of the body, allowing fabric to settle, drape, and respond without force or excess. The focus is not on trend or decoration, but on presence, balance, and longevity, creating garments that feel intentional, lived-in, and quietly timeless.";
const HERO_MANIFESTO_LINE_4 = "Quiet construction.";

function readRootCssNumber(variableName, fallback) {
  if (typeof window === "undefined") return fallback;
  const rawValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

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

function Scene({
  background,
  height = "200vh",
  children,
  sectionRef,
  overlay,
}) {
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
      {overlay}
      <div style={styles.sceneContent}>{children}</div>
    </section>
  );
}

function ScrollScene({
  background,
  height = "140vh",
  children,
  overlay,
  topOverlay,
}) {
  return (
    <section
      style={{
        ...styles.scrollSceneSection,
        minHeight: height,
        backgroundImage: `url('${background}')`,
      }}
    >
      {overlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {overlay}
        </div>
      )}
      <div style={styles.scrollSceneContent}>{children}</div>
      {topOverlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {topOverlay}
          </div>
        </div>
      )}
    </section>
  );
}

const HoverWordText = ({ text }) => {
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);

  if (!text) return null;

  let wordCounter = 0;
  return text.split(/(\s+)/).map((part, i) => {
    if (/\s+/.test(part)) return <span key={i}>{part}</span>;

    const currentIndex = wordCounter++;
    let distanceClass = "";

    if (hoveredWordIndex !== null) {
      const dist = Math.abs(hoveredWordIndex - currentIndex);
      if (dist === 0) distanceClass = "hover-dist-0";
      else if (dist === 1) distanceClass = "hover-dist-1";
      else if (dist === 2) distanceClass = "hover-dist-2";
      else if (dist === 3) distanceClass = "hover-dist-3";
    }

    return (
      <span
        key={i}
        className={`hover-word ${distanceClass}`}
        onMouseEnter={() => setHoveredWordIndex(currentIndex)}
        onMouseLeave={() => setHoveredWordIndex(null)}
      >
        {part}
      </span>
    );
  });
};

export default function Home() {
  const heroRef = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const shopTargetRef = useRef(null);
  const scrollRafRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start 70%", "end 30%"],
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

  const { scrollYProgress: shopScroll } = useScroll({
    target: shopTargetRef,
    offset: ["start end", "start 0.5%"],
  });

  // Hero logo morph settings (tweak these values)
  const HERO_LOGO_TWEAK = {
    widthRem: 18.5,
    moveEnd: 0.34,
    lockStart: 0.34,
    lockEnd: 0.4,
    xEnd: -60, // px: negative = move left, positive = move right
    yEnd: -150, // px: negative = move up
    yOffset: -2.5, // 👈 Logo vertical height relative to FORM
    logoX: 1, // 👈 Logo horizontal gap from FORM (rem)
    commonY: -5.5, // 👈 "COMMON" vertical height (rem)
    formY: -9.5, // 👈 "FORM" vertical height (rem)

    // MASTER GROUP POSITION (Moves EVERYTHING together)
    groupY: 3.6, // 👈 Move the whole group UP/DOWN (rem)
    groupX: 0, // 👈 Move the whole group LEFT/RIGHT (rem)

    scaleEnd: 0.33,
    fixedLeft: "19.2rem",
    fixedTop: "4%",
  };

  const heroLogoX = useTransform(
    heroScroll,
    [0, HERO_LOGO_TWEAK.moveEnd],
    [0, HERO_LOGO_TWEAK.xEnd],
  );
  const heroLogoY = useTransform(
    heroScroll,
    [0, HERO_LOGO_TWEAK.moveEnd],
    [0, HERO_LOGO_TWEAK.yEnd],
  );
  const heroLogoScale = useTransform(
    heroScroll,
    [0, HERO_LOGO_TWEAK.moveEnd],
    [1, HERO_LOGO_TWEAK.scaleEnd],
  );
  const heroLogoInlineOpacity = useTransform(
    heroScroll,
    [HERO_LOGO_TWEAK.lockStart, HERO_LOGO_TWEAK.lockEnd],
    [1, 0],
  );

  const heroCopyScrollConfig = useMemo(
    () => ({
      start: readRootCssNumber(
        "--hero-copy-scroll-start",
        HERO_COPY_SCROLL_DEFAULTS.start,
      ),
      end: readRootCssNumber(
        "--hero-copy-scroll-end",
        HERO_COPY_SCROLL_DEFAULTS.end,
      ),
      stagger: readRootCssNumber(
        "--hero-copy-scroll-stagger",
        HERO_COPY_SCROLL_DEFAULTS.stagger,
      ),
      fromOpacity: readRootCssNumber(
        "--hero-copy-scroll-from-opacity",
        HERO_COPY_SCROLL_DEFAULTS.fromOpacity,
      ),
      fromY: readRootCssNumber(
        "--hero-copy-scroll-from-y",
        HERO_COPY_SCROLL_DEFAULTS.fromY,
      ),
      fromScale: readRootCssNumber(
        "--hero-copy-scroll-from-scale",
        HERO_COPY_SCROLL_DEFAULTS.fromScale,
      ),
    }),
    [],
  );
  // Logo scale from initial size (29rem) to final size (6rem) - ratio: 6/29 ≈ 0.207
  // Scales from 1 (full size) to 6/29 (final size) as you scroll
  const logoScale = useTransform(heroScroll, [0, 0.25], [1, 4.5 / 7]);
  const logoOpacity = useTransform(heroScroll, [0.18, 0.28], [0, 1]);
  const handshakeVideoOpacity = useTransform(shopScroll, [0.9, 1], [0, 1]); // Added for shop section restriction
  const headerLogoX = "6.5rem"; // Fixed final position

  // Header opacity control
  const headerOpacity = useTransform(
    heroScroll,
    [0.15, 0.65, 0.7],
    [0, 20, 40],
  );
  const headerBandOpacity = useTransform(heroScroll, [0.18, 0.28], [0, 1]);

  const heroParagraphColor = useTransform(
    scrollYProgress,
    [0.7, 0.73], // adjust if needed
    ["#ffffff", "#0a0a0a"],
  );

  const heroCopyLine1Range = [
    heroCopyScrollConfig.start,
    heroCopyScrollConfig.end,
  ];
  const heroCopyLine2Range = [
    heroCopyScrollConfig.start + heroCopyScrollConfig.stagger,
    heroCopyScrollConfig.end + heroCopyScrollConfig.stagger,
  ];
  const heroCopyLine3Range = [
    heroCopyScrollConfig.start + heroCopyScrollConfig.stagger * 2,
    heroCopyScrollConfig.end + heroCopyScrollConfig.stagger * 2,
  ];
  const heroCopyLine4Range = [
    heroCopyScrollConfig.start + heroCopyScrollConfig.stagger * 3,
    heroCopyScrollConfig.end + heroCopyScrollConfig.stagger * 3,
  ];
  const heroBack1Range = [
    heroCopyScrollConfig.start + heroCopyScrollConfig.stagger * 4,
    heroCopyScrollConfig.end + heroCopyScrollConfig.stagger * 4,
  ];

  const heroCopyLine1Opacity = useTransform(
    scrollYProgress,
    heroCopyLine1Range,
    [heroCopyScrollConfig.fromOpacity, 1],
  );
  const heroCopyLine1Y = useTransform(scrollYProgress, heroCopyLine1Range, [
    heroCopyScrollConfig.fromY,
    0,
  ]);
  const heroCopyLine1Scale = useTransform(scrollYProgress, heroCopyLine1Range, [
    heroCopyScrollConfig.fromScale,
    1,
  ]);

  const heroCopyLine2Opacity = useTransform(
    scrollYProgress,
    heroCopyLine2Range,
    [heroCopyScrollConfig.fromOpacity, 1],
  );
  const heroCopyLine2Y = useTransform(scrollYProgress, heroCopyLine2Range, [
    heroCopyScrollConfig.fromY,
    0,
  ]);
  const heroCopyLine2Scale = useTransform(scrollYProgress, heroCopyLine2Range, [
    heroCopyScrollConfig.fromScale,
    1,
  ]);

  const heroCopyLine3Opacity = useTransform(
    scrollYProgress,
    heroCopyLine3Range,
    [heroCopyScrollConfig.fromOpacity, 1],
  );
  const heroCopyLine3Y = useTransform(scrollYProgress, heroCopyLine3Range, [
    heroCopyScrollConfig.fromY,
    0,
  ]);
  const heroCopyLine3Scale = useTransform(scrollYProgress, heroCopyLine3Range, [
    heroCopyScrollConfig.fromScale,
    1,
  ]);

  const heroCopyLine4Opacity = useTransform(
    scrollYProgress,
    heroCopyLine4Range,
    [heroCopyScrollConfig.fromOpacity, 1],
  );
  const heroCopyLine4Y = useTransform(scrollYProgress, heroCopyLine4Range, [
    heroCopyScrollConfig.fromY,
    0,
  ]);
  const heroCopyLine4Scale = useTransform(scrollYProgress, heroCopyLine4Range, [
    heroCopyScrollConfig.fromScale,
    1,
  ]);

  const heroBack1Opacity = useTransform(scrollYProgress, heroBack1Range, [
    heroCopyScrollConfig.fromOpacity,
    1,
  ]);
  const heroBack1Y = useTransform(scrollYProgress, heroBack1Range, [
    heroCopyScrollConfig.fromY,
    0,
  ]);
  const heroBack1Scale = useTransform(scrollYProgress, heroBack1Range, [
    heroCopyScrollConfig.fromScale,
    1,
  ]);

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

  const scrollToShopSection = () => {
    if (typeof window === "undefined" || !shopTargetRef.current) {
      return;
    }

    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }

    const startY = window.scrollY;
    const targetY = Math.max(
      shopTargetRef.current.getBoundingClientRect().top + window.scrollY,
      0,
    );
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      window.scrollTo({ top: targetY });
      return;
    }

    const duration = 520;
    const startTime = performance.now();
    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutQuint(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        scrollRafRef.current = requestAnimationFrame(step);
      } else {
        scrollRafRef.current = null;
      }
    };

    scrollRafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={{ height: "0.5px" }} />
        <motion.div
          className="hero-header-band"
          style={{
            "--hero-header-band-progress": headerBandOpacity,
          }}
        />

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
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "3.9rem",
            pointerEvents: "none",
          }}
        >
          {/* HANDSHAKE OVERLAY */}
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              opacity: handshakeVideoOpacity,
              width: "auto",
              height: "100%",
              paddingRight: "5.4rem", // Padding to adjust position
              transform: "translateX(0px)", // Adjust position here
            }}
          >
            <span className="handshake-archive-text">ARCHIVE</span>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                paddingRight: "0.6rem",
                height: "4.2rem", // Base height
                width: "auto", // Keep auto or set specific width to stretch
                transform: "scaleX(1.3) scaleY(1.0)", // STRETCH CONTROLS: Adjust scaleX/scaleY here
                mixBlendMode: "lighten",
                filter: "brightness(1.8) contrast(1.1)",
                objectFit: "cover", // Ensures video fills the specified scale properly
              }}
              onLoadedMetadata={(e) => {
                e.target.playbackRate = 0.8;
              }}
            >
              <source src="/images/handshake.webm" type="video/webm" />
            </video>
          </motion.div>

          <motion.div
            style={{
              position: "fixed",
              left: 0,
              x: headerLogoX,
              top: "4.5%",
              y: "-50%",
              fontFamily: "Galgo",
              fontSize: "3.2rem",
              letterSpacing: "0.22rem",
              color: "#fcf4f4",
              fontWeight: 300,
              opacity: logoOpacity,
              transformOrigin: "left center",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span>COMMON FORM</span>
            <img
              src="/images/logo.png"
              alt="logo"
              style={{
                height: "2.4rem",
                width: "auto",
                filter: "brightness(0) invert(1)",
              }}
            />
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
          overlay={
            <div
              style={{
                gridArea: "1 / 1",
                alignSelf: "start",
                position: "sticky",
                top: 0,
                zIndex: 10,
                height: "100vh",
                width: "100%",
                pointerEvents: "none",
              }}
            >
              <FireflyLayer />
              <LightLayer />
            </div>
          }
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
            <div className="scene1-bottom-copy" aria-hidden="true">
              <p>
                {" "}
                EXISTS OUTSIDE THE ORDINARY EXISTS OUTSIDE THE ORDINARY EXISTS
                OUTSIDE THE ORDINARY EXISTS
                <br />
                OUTSIDE THE ORDINARY EXISTS OUTSIDE THE ORDINARY EXISTS OUTSIDE
                THE ORDINARY EXISTS
              </p>
            </div>
          </div>
          <div className="scene-shop-overlay">
            <div className="scene-shop-sticky">
              <button
                type="button"
                className="shop-now-btn scene1-shop-btn"
                onClick={scrollToShopSection}
              >
                SHOP NOW
              </button>
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
                  <motion.div
                    style={{
                      y: `${HERO_LOGO_TWEAK.groupY}rem`,
                      x: `${HERO_LOGO_TWEAK.groupX}rem`,
                    }}
                  >
                    <motion.div
                      style={{
                        display: "block",
                        scale: logoScalep,
                        transformOrigin: "left center",
                        y: `${HERO_LOGO_TWEAK.commonY}rem`,
                      }}
                    >
                      <StaggeredHeadingWord
                        word="COMMON"
                        className="common-text"
                      />
                    </motion.div>

                    <motion.div
                      className="form-wrapper"
                      style={{
                        display: "block",
                        scale: logoScalep,
                        transformOrigin: "left center",
                        y: `${HERO_LOGO_TWEAK.formY}rem`,
                      }}
                    >
                      <StaggeredHeadingWord
                        word="FORM"
                        className="form-text"
                        startIndex={8}
                      />
                      <motion.img
                        className="hero-heading-logo"
                        src="/images/logo.png"
                        alt="logo"
                        variants={titleLetter} // 🔥 IMPORTANT
                        custom={7} // delay (adjust if needed)
                        initial="hidden"
                        animate="visible"
                        style={{
                          width: `${HERO_LOGO_TWEAK.widthRem}rem`,
                          display: "inline-block",
                          marginLeft: `${HERO_LOGO_TWEAK.logoX}rem`,
                          verticalAlign: "middle",
                          marginTop: `${HERO_LOGO_TWEAK.yOffset}rem`,
                          transformOrigin: "left center",
                          willChange: "transform, opacity",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.h1>

                <motion.div
                  style={{
                    opacity: heroCopyLine1Opacity,
                    y: heroCopyLine1Y,
                    scale: heroCopyLine1Scale,
                    transformOrigin: "left center",
                  }}
                >
                  <motion.p
                    className="texture-copy hero-manifesto-line hero-manifesto-line-1"
                    data-text={HERO_MANIFESTO_LINE_1}
                    style={{
                      ...styles.heroLine,
                      color: heroParagraphColor,
                    }}
                  >
                    {HERO_MANIFESTO_LINE_1}
                  </motion.p>
                </motion.div>
                <motion.div
                  style={{
                    opacity: heroCopyLine2Opacity,
                    y: heroCopyLine2Y,
                    scale: heroCopyLine2Scale,
                    transformOrigin: "left center",
                  }}
                >
                  <motion.p
                    className="texture-copy hero-manifesto-line hero-manifesto-line-2"
                    data-text={HERO_MANIFESTO_LINE_2}
                    style={{
                      ...styles.heroLine2,
                      color: heroParagraphColor,
                    }}
                  >
                    {HERO_MANIFESTO_LINE_2}
                  </motion.p>
                </motion.div>
                <motion.div
                  style={{
                    opacity: heroCopyLine3Opacity,
                    y: heroCopyLine3Y,
                    scale: heroCopyLine3Scale,
                    transformOrigin: "left center",
                  }}
                >
                  <motion.p
                    className="texture-copy hero-manifesto-line hero-manifesto-line-3"
                    data-text={HERO_MANIFESTO_LINE_3}
                    style={{
                      ...styles.heroLine3,
                      color: heroParagraphColor,
                    }}
                  >
                    {HERO_MANIFESTO_LINE_3}
                  </motion.p>
                </motion.div>
                <motion.div
                  style={{
                    opacity: heroCopyLine4Opacity,
                    y: heroCopyLine4Y,
                    scale: heroCopyLine4Scale,
                    transformOrigin: "left center",
                  }}
                >
                  <motion.p
                    className="texture-copy hero-manifesto-line hero-manifesto-line-4"
                    data-text={HERO_MANIFESTO_LINE_4}
                    style={{
                      ...styles.heroLine,
                      color: heroParagraphColor,
                    }}
                  >
                    {HERO_MANIFESTO_LINE_4}
                  </motion.p>
                </motion.div>

                <motion.img
                  src="/images/back1.png"
                  alt=""
                  style={{
                    paddingLeft: "6rem",
                    width: "800px", // adjust size
                    marginTop: "1rem",
                    opacity: heroBack1Opacity,
                    y: heroBack1Y,
                    scale: heroBack1Scale,
                    transformOrigin: "left center",
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
          overlay={
            <>
              <HalftoneFilter />
              <Scene2CompositeEffect />
              <div className="scene2-clouds-overlay">
                <div className="scene2-clouds-sticky">
                  <div className="scene2-clouds-track">
                    <img
                      src="/images/clouds.png"
                      alt=""
                      aria-hidden="true"
                      className="scene2-cloud-img"
                    />
                    <img
                      src="/images/clouds.png"
                      alt=""
                      aria-hidden="true"
                      className="scene2-cloud-img"
                    />
                  </div>
                </div>
              </div>
              <div className="scene2-nocloud-visible">
                <img src="/images/nocloud.png" alt="" aria-hidden="true" />
              </div>
            </>
          }
        >
          <div className="scene-image-wrapper">
            <div className="scene2-video-background">
              <ThermalGlitchImage
                src="/images/butter.png"
                className="scene2-video"
                intervalMs={3200}
                durationMs={1800}
                jitterMs={800}
                speed="var(--butter-glitch-speed, 180ms)"
                intensityX="var(--butter-glitch-x, 1.5px)"
                intensityY="var(--butter-glitch-y, 1.2px)"
                opacity="var(--butter-glitch-opacity, 0.95)"
                thermalSaturate="var(--butter-thermal-saturate, 3200%)"
                negativeSaturate="var(--butter-negative-saturate, 230%)"
                brightness="var(--butter-glitch-brightness, 1.25)"
                contrast="var(--butter-glitch-contrast, 1.2)"
                showThermal={false}
                showNegative={false}
              />
            </div>
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
                    {[...Array(40)].map((_, i) => (
                      <p key={i}>
                        COMMON FORM
                        <img
                          src="/images/logo.png"
                          alt="logo"
                          className="ticker-logo"
                        />
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scene-shop-overlay">
            <div className="scene-shop-sticky">
              <button
                type="button"
                className="shop-now-btn scene2-shop-btn"
                onClick={scrollToShopSection}
              >
                SHOP NOW
              </button>
            </div>
          </div>
          <div className="scene2-text-container">
            <p
              className="scene2-line scene2-line-1 scene2-varsity-distort"
              data-text="FORM VARSITY"
            >
              FORM VARSITY
            </p>

            <p className="scene2-line scene2-line-2">BUILT ON STRUCTURE</p>
            <p
              className="scene2-line scene2-line-3"
              style={{
                ...styles.heroLine3,
                color: "#cb2e07",
              }}
            >
              Built for those who move with purpose, FORM VARSITY blends
              structure with effortless style. Every piece is designed to feel
              intentional — clean lines, bold presence, and a fit that speaks
              without saying too much. It’s about confidence that doesn’t need
              validation, and style that works anywhere, from everyday moments
              to standout scenes. Inspired by movement, individuality, and
              modern street culture, this collection balances comfort with
              identity. FORM VARSITY isn’t just something you wear — it becomes
              a part of how you carry yourself, how you show up, and how you
              leave an impression.
            </p>

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
          overlay={
            <div
              style={{
                gridArea: "1 / 1",
                alignSelf: "start",
                position: "sticky",
                top: 0,
                zIndex: 1,
                height: "100vh",
                width: "100%",
                pointerEvents: "none",
              }}
            >
              <LiquidBackgroundRed />
            </div>
          }
        >
          <div className="scene-image-wrapper">
            <div className="scene-image-sticky">
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <img
                  src="/images/b1.png"
                  className="scene-image scene3-b1"
                  alt=""
                />
                <img
                  src="/images/b2.png"
                  className="scene-image scene3-b2"
                  alt=""
                />
              </div>

              <FalseColorGlitchImage
                src="/images/scene3a.png"
                alt=""
                imageClassName="scene-image scene-image-3a"
                intervalMs={4000}
                durationMs={600}
                jitterMs={1100}
              />

              <ThermalGlitchImage
                src="/images/scene3b.png"
                className="scene-image scene-image-3b"
                speed="var(--scene3b-glitch-speed, 180ms)"
                intensityX="var(--scene3b-glitch-x, 1px)"
                intensityY="var(--scene3b-glitch-y, 1px)"
                opacity="var(--scene3b-glitch-opacity, 1)"
                intervalMs={4000}
                durationMs={600}
                jitterMs={1100}
              />

              {/* 🔥 ADD THIS */}
              <TextScramble
                as="div"
                className="shoe-name"
                text="CF-AXIS/01"
                animateOnView
              />
              <div className="shoename2">CF-GRND</div>
              <div className="shoetxt">
                <HoverWordText
                  text={`CF-GRND is built as an extension of structure rather than decoration — a form that exists in balance with movement, weight, and space. The silhouette follows a controlled geometry, where each panel, seam, and material transition is placed with intention, allowing the shoe to feel both grounded and adaptive. There is no excess, no unnecessary noise — only a quiet system of layers working together beneath the surface.The construction prioritizes stability without rigidity,`}
                />
              </div>
            </div>

            {/* 🔥 SCROLLABLE TEXT (ADD HERE) */}
            <div className="shoetxt-left">
              <HoverWordText
                text={`CF-AXIS/01 is built on the idea that structure should not compete with expression, but quietly enable it. Every element exists with intent—nothing added for decoration, nothing removed for effect—resulting in a form that feels grounded, precise, and deliberate. The design draws from the tension between rigidity and movement, where sharp lines meet adaptive flexibility, allowing the piece to respond naturally to the body while maintaining a defined silhouette. Materials are selected not just for durability, but for how they age, how they react to light, and how they carry the identity of the wearer over time. Each panel, seam, and layer works in balance, creating a system where function and aesthetic are inseparable. CF-AXIS/01 does not aim to stand out through excess; instead, it establishes presence through clarity—through proportion, restraint, and confidence. It is designed for motion, for everyday transitions, and for moments where identity is expressed not loudly, but unmistakably. In a space crowded by noise and overstatement, CF-AXIS/01 remains focused, offering a refined interpretation of contemporary form where stability meets evolution, and where design becomes an extension of how you move, exist, and leave a lasting impression.`}
              />
            </div>

            <div className="scene3-shoe">
              <img
                src="/images/shoeback.png"
                alt="style visual"
                className="shoebackimage"
              />
            </div>
            <div className="scene3-text">CF-AXIS/01</div>
          </div>
          <div className="scene-shop-overlay">
            <div className="scene-shop-sticky">
              <button
                type="button"
                className="shop-now-btn scene3-shop-btn"
                onClick={scrollToShopSection}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </Scene>

        <ScrollScene
          background="/images/backgrounds.jpg"
          height="100vh"
          overlay={
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <LiquidBackground />
              <div className="shop-light-source" />
            </div>
          }
          topOverlay={
            <>
              <HalftoneFilter opacity={0.05} />
              <Scene2CompositeEffect opacity={0.3} />
            </>
          }
        >
          <div ref={shopTargetRef} style={styles.siteSection}>
            <div style={styles.container}>
              {/* Left - Product Info */}
              <div style={styles.descriptionSection}>
                <h3 className="product-copy-common product-copy-heading">
                  {activeProduct.name}
                </h3>
                <p className="product-copy-common product-copy-description">
                  {activeProduct.description}
                </p>
                <p className="product-copy-common product-copy-price">
                  {activeProduct.price}
                </p>
                <button type="button" className="product-buy-now-btn">
                  BUY NOW
                </button>
              </div>

              {/* Center - Product media */}
              <div style={styles.carouselSection}>
                {/* MAIN VIEW */}
                <div style={styles.viewerWrapper}>
                  <button style={styles.arrowLeft} onClick={goPrev}>
                    ‹
                  </button>

                  {activeMedia.type === "model" ? (
                    <AutoRotateModelViewer modelPath={activeMedia.src} />
                  ) : (
                    <img
                      src={activeMedia.src}
                      alt={activeProduct.name}
                      style={styles.viewerImage}
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
                        {media.type === "model" ? (
                          <span style={styles.modelThumbnailLabel}>3D</span>
                        ) : (
                          <img
                            src={media.src}
                            alt=""
                            style={styles.thumbnailImage}
                          />
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
    padding: "0.5rem 2rem",
    backgroundColor: "transparent",
  },
  headerInner: {
    padding: "0.1rem 4.5rem",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    backgroundColor: "transparent",
    lineHeight: "3rem",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  headerBrand: {
    fontFamily: "panchang",
    fontSize: "0.8rem",
    letterSpacing: "0.35em",
    color: "#ffffff",
    opacity: 0.9,
  },
  headerNav: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
  },
  headerLink: {
    fontFamily: "panchang",
    fontSize: "0.8rem",
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
    fontFamily: "panchang",
    fontSize: "0.85rem",
    letterSpacing: "0.15em",
    color: "#888888",
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
    textAlign: "left",
    alignItems: "flex-start",
    marginLeft: "-2.1rem",
    position: "relative",
    left: "0%",
    top: "0%",
    "--product-copy-left": "0%",
    "--product-copy-top": "0%",
    "--product-buy-btn-left": "0%",
    "--product-buy-btn-top": "0%",
    "--product-heading-size": "240%",
    "--product-description-size": "105%",
    "--product-price-size": "180%",
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
    fontFamily: "panchang",
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

  modelThumbnailLabel: {
    fontSize: "0.72rem",
    letterSpacing: "0.16em",
    color: "#d1d5db",
    fontWeight: 600,
  },

  viewerImage: {
    width: "100%",
    height: "500px",
    objectFit: "contain",
  },

  viewerWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
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
    zIndex: 1,
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
    paddingTop: "0rem",
  },

  commonText: {
    fontSize: "29rem",
    lineHeight: 0.9,
    display: "block",
  },
};
