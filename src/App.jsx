import { useRef, useState, useEffect, memo } from "react";
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "remixicon/fonts/remixicon.css";
import Navbar from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

const T = {
  gold: "#F5C842",
  orange: "#E8732A",
  teal: "#3BBFBF",
  cream: "#FFF8EE",
  dark: "#0D0D0D",
  mid: "#1A1209",
  font: "'Rye', serif",
  mono: "'Courier New', monospace",
  sans: "'Helvetica Neue', sans-serif",
};

/* ─────────────────────────────────────────────
   CSS for CategoriesGrid — injected once at module level
───────────────────────────────────────────── */
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .cat-card {
    position: relative;
    aspect-ratio: 1;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.02);
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 16px;
    text-decoration: none;
    overflow: hidden;
  }
  .cat-card:hover {
    transform: scale(1.03);
    border-color: #F5C842;
    background: rgba(255,255,255,0.04);
  }
  .cat-card:hover .cat-count {
    color: #fff;
  }
`;
document.head.appendChild(styleSheet);

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [showContent, setShowContent] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const mainRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(".ut-mask-group", {
      rotate: 10,
      ease: "power4.inOut",
      duration: 2,
      transformOrigin: "50% 50%",
    }).to(".ut-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "expo.inOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onComplete: () => {
        const svgEl = document.querySelector(".svg-intro");
        if (svgEl)
          setTimeout(() => {
            svgEl.remove();
            setShowContent(true);
          }, 100);
      },
    });
  }, []);

  /* ── FIX 2: tilt bug — re-run entrance animation whenever activePage changes to "home" */
  useGSAP(
    () => {
      if (!showContent) return;

      gsap.to(".main-wrapper", {
        scale: 1,
        rotate: 0,
        duration: activePage === "home" ? 2 : 0,
        delay: activePage === "home" ? 0.1 : 0,
        ease: "expo.inOut",
      });
      gsap.to(".sky", {
        scale: 1.05,
        rotate: 0,
        duration: activePage === "home" ? 2 : 0,
        delay: activePage === "home" ? -0.8 : 0,
        ease: "expo.inOut",
      });
      gsap.to(".city", {
        scale: 1.08,
        rotate: 0,
        duration: activePage === "home" ? 2 : 0,
        delay: activePage === "home" ? -0.8 : 0,
        ease: "expo.inOut",
      });
      gsap.to(".girl", {
        scale: 0.52,
        x: "-50%",
        rotate: 0,
        duration: activePage === "home" ? 2 : 0,
        delay: activePage === "home" ? -0.8 : 0,
        ease: "expo.inOut",
      });
      gsap.to(".herotext", {
        scale: 1,
        bottom: "auto",
        top: "12%",
        rotate: 0,
        duration: activePage === "home" ? 2 : 0,
        delay: activePage === "home" ? -0.8 : 0,
        ease: "expo.inOut",
      });

      // mouse parallax — only attach on home
      if (activePage !== "home") return;
      const hero = document.querySelector(".hero-section");
      const onMove = (e) => {
        const xMove = (e.clientX / window.innerWidth - 0.5) * 36;
        const yMove = (e.clientY / window.innerHeight - 0.5) * 14;
        gsap.to(".sky", {
          x: xMove * 0.4,
          y: yMove * 0.2,
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(".city", {
          x: xMove * 0.9,
          y: yMove * 0.4,
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(".girlbg", {
          x: `calc(-50% + ${xMove * 0.25}px)`,
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(".herotext", {
          x: xMove * 0.15,
          duration: 0.6,
          ease: "power2.out",
        });
      };
      hero?.addEventListener("mousemove", onMove);
      return () => hero?.removeEventListener("mousemove", onMove);
    },
    { dependencies: [showContent, activePage] }
  );

  useGSAP(
    () => {
      if (!showContent) return;

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            delay: (el.dataset.delay || 0) * 1,
          }
        );
      });

      gsap.utils.toArray(".reveal-left").forEach((el) => {
        gsap.fromTo(
          el,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }
        );
      });

      gsap.utils.toArray(".reveal-right").forEach((el) => {
        gsap.fromTo(
          el,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }
        );
      });
    },
    { dependencies: [showContent] }
  );

  return (
    <div
      style={{ fontFamily: T.font, background: T.dark, overflowX: "hidden" }}
    >
      <div
        className="svg-intro"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          style={{ width: "100vw", height: "100vh" }}
        >
          <defs>
            <mask id="utMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="ut-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="220"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="'Rye', serif"
                  letterSpacing="8"
                >
                  SB
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="/city.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#utMask)"
          />
          <rect
            width="100%"
            height="100%"
            fill="rgba(245,200,66,0.18)"
            mask="url(#utMask)"
          />
        </svg>
        <p
          style={{
            position: "absolute",
            bottom: "7%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(245,200,66,0.7)",
            fontFamily: T.mono,
            letterSpacing: "0.4em",
            fontSize: "clamp(0.6rem,1.5vw,0.85rem)",
            textTransform: "uppercase",
          }}
        >
          FROM IDEA TO EXECUTION
        </p>
      </div>

      {showContent && (
        <>
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          {activePage === "home" && <HomePage mainRef={mainRef} />}
          {activePage === "projects" && <ProjectsPage />}
          {activePage === "about" && <AboutPage />}
          {activePage === "contact" && <ContactPage />}
        </>
      )}

      <style>{globalCSS}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ mainRef }) {
  return (
    <div
      ref={mainRef}
      className="main-wrapper"
      style={{
        rotate: "-10deg",
        scale: "1.7",
        transformOrigin: "center center",
      }}
    >
      <section
        className="hero-section"
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          background: "#0a1a1a",
        }}
      >
        <img
          className="sky"
          src="/sky.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: "1.5",
            rotate: "-20deg",
            transformOrigin: "50% 50%",
          }}
        />
        <img
          className="city"
          src="/city.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: "1.8",
            rotate: "-25deg",
            transformOrigin: "50% 50%",
          }}
        />

        <div
          className="herotext"
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            scale: "1.4",
            rotate: "-10deg",
            transformOrigin: "50% 50%",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(3.5rem,10vw,7rem)",
              color: "#fff",
              lineHeight: 0.88,
              marginLeft: "-12%",
              textShadow: "3px 4px 0 rgba(0,0,0,0.4)",
            }}
          >
            Sarthak
          </h1>
          <h1
            style={{
              fontSize: "clamp(2.8rem,8.5vw,6rem)",
              color: T.gold,
              lineHeight: 0.92,
              textShadow: `2px 3px 0 rgba(0,0,0,0.5)`,
            }}
          >
            Bhagat
          </h1>
        </div>

        <img
          className="profile"
          src="/profile.png"
          alt="Model"
          style={{
            position: "absolute",
            bottom: "-80%",
            left: "50%",
            transform: "translateX(-50%)",
            scale: "1",
            rotate: "-10deg",
            zIndex: 8,
            transformOrigin: "50% 100%",
            filter: "drop-shadow(0 -8px 40px rgba(245,200,66,0.25))",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            padding: "clamp(14px,3vw,32px) clamp(16px,4vw,40px)",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <i
            className="ri-arrow-down-fill"
            style={{ fontSize: "1.2rem", animation: "bounce 1.6s infinite" }}
          />
          <span
            style={{
              fontSize: "clamp(0.65rem,1.4vw,0.85rem)",
              letterSpacing: "0.32em",
            }}
          >
            Scroll Down
          </span>
        </div>
      </section>

      <MarqueeStrip />
      <AboutStrip />
      <FeaturedDrops />
      <FullWidthBanner />
      <CategoriesGrid />
      <Connect />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────── */
function MarqueeStrip() {
  const items = [
    "JavaScript",
    "★",
    "Java",
    "★",
    "React",
    "★",
    "Node",
    "★",
    "Express",
    "★",
    "NoSQL",
    "★",
    "SQL",
    "★",
    "Docker",
    "★",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        background: T.gold,
        overflow: "hidden",
        padding: "12px 0",
        borderTop: `3px solid ${T.orange}`,
        borderBottom: `3px solid ${T.orange}`,
      }}
    >
      <div
        className="marquee-track"
        style={{ display: "flex", whiteSpace: "nowrap" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              paddingRight: "clamp(20px,4vw,48px)",
              color: T.dark,
              fontFamily: T.font,
              fontSize: "clamp(0.75rem,1.8vw,1rem)",
              letterSpacing: "0.18em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT STRIP
───────────────────────────────────────────── */
function AboutStrip() {
  return (
    <section
      style={{
        background: T.dark,
        padding: "clamp(60px,8vw,110px) clamp(20px,7vw,80px)",
        display: "flex",
        flexWrap: "wrap",
        gap: "clamp(32px,6vw,80px)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${T.teal}, ${T.gold}, ${T.orange})`,
        }}
      />

      <div className="reveal-left" style={{ flex: "1 1 320px", maxWidth: 520 }}>
        <p
          style={{
            color: T.gold,
            fontFamily: T.mono,
            letterSpacing: "0.4em",
            fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
            marginBottom: 18,
          }}
        >
          — FROM IDEA TO EXECUTION
        </p>
        <h2
          style={{
            fontSize: "clamp(2.2rem,6vw,4.5rem)",
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          Engineering Real-Time
          <br />
          <span style={{ color: T.gold }}>Systems.</span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontFamily: T.sans,
            fontSize: "clamp(0.9rem,1.6vw,1.05rem)",
            lineHeight: 1.75,
            marginBottom: 16,
          }}
        >
          I'm a pre-final year ECE student and MERN Stack Developer focused on
          building scalable and real-time web applications.
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: T.sans,
            fontSize: "clamp(0.82rem,1.4vw,0.95rem)",
            lineHeight: 1.7,
          }}
        >
          Learning by building. Scaling by solving.
        </p>
        <div
          style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}
        >
          <GoldBtn
            onClick={() => window.open("https://github.com/Sarthak-Bhagat2006")}
          >
            GitHub
          </GoldBtn>
          <GoldBtn
            onClick={() =>
              window.open("https://leetcode.com/u/SarthakBhagt2006/")
            }
          >
            LeetCode
          </GoldBtn>
        </div>
      </div>

      <div
        className="reveal-right"
        style={{
          flex: "1 1 260px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(20px,4vw,40px)",
        }}
      >
        {[
          { n: "400+", label: "Problems Solved" },
          { n: "5+ PRs", label: "Production-level fixes" },
          { n: "1483", label: "LeetCode Rating" },
          { n: "∞", label: "Learning Mode" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              border: `1px solid rgba(245,200,66,0.2)`,
              padding: "clamp(18px,3vw,32px)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -1,
                left: 8,
                right: 8,
                height: 2,
                background: T.gold,
                opacity: 0.6,
              }}
            />
            <div
              style={{
                fontSize: "clamp(2rem,5vw,3rem)",
                color: T.gold,
                lineHeight: 1,
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: T.mono,
                letterSpacing: "0.22em",
                fontSize: "clamp(0.55rem,1.1vw,0.68rem)",
                marginTop: 6,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURED DROPS
───────────────────────────────────────────── */
const drops = [
  {
    img: "/saarthi.png",
    name: "Personal AI-assistant",
    desc: "Built and deployed a full-stack AI assistant following SDLC practices, used by 200+ users, handling 1k+ daily API requests with JWT-secured APIs on a scalable backend architecture.",
    url: "https://saarthi-ai-assistant-frontend.vercel.app/",
  },
  {
    img: "/chargehub.png",
    name: "EV Charging Station Listing Platform",
    desc: "Developed a full-stack EV charging listing platform connecting private charger owners with users through interactive map-based discovery and pricing visibility.",
    url: "https://charge-hub-delta.vercel.app/listings",
  },
  {
    img: "/bullnest.png",
    name: "Real Time Stock Trading Simulator",
    desc: "Built a full-stack stock trading simulator handling real-time financial transactions with virtual currency, enabling users to buy/sell stocks and track their portfolio in real time.",
    url: "https://github.com/Sarthak-Bhagat2006/Bullnest-Trading-Simulator",
  },
];

function FeaturedDrops() {
  return (
    <section
      style={{
        background: "#0c0c0c",
        padding: "clamp(60px,8vw,110px) clamp(20px,5vw,60px)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="reveal-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(28px,5vw,56px)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                color: T.teal,
                fontFamily: T.mono,
                letterSpacing: "0.4em",
                fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
                marginBottom: 8,
              }}
            >
              — Live Projects
            </p>
            <h2
              style={{
                fontSize: "clamp(2.2rem,6vw,4.5rem)",
                color: "#fff",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
              }}
            >
              The Latest <span style={{ color: T.gold }}>Projects</span>
            </h2>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%,260px), 1fr))",
            gap: "clamp(12px,2vw,24px)",
          }}
        >
          {drops.map((d, i) => (
            <ProductCard key={i} drop={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ drop, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="reveal-up"
      data-delay={index * 0.08}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(drop.url)}
      style={{
        background: "#161616",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 0.35s cubic-bezier(.16,1,.3,1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        border: hovered
          ? `1px solid ${T.gold}`
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}
      >
        <img
          src={drop.img}
          alt={drop.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(.16,1,.3,1)",
            filter: hovered
              ? "brightness(0.7) saturate(1.3)"
              : "brightness(0.85) saturate(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
            transform: hovered ? "translateY(0)" : "translateY(20px)",
            opacity: hovered ? 1 : 0,
            transition: "all 0.35s ease",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: T.sans,
              fontSize: "clamp(0.75rem,1.3vw,0.85rem)",
              margin: 0,
            }}
          >
            {drop.desc}
          </p>
        </div>
      </div>
      <div style={{ padding: "clamp(14px,2vw,20px)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: "clamp(0.9rem,1.6vw,1.05rem)",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            {drop.name}
          </h3>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 2,
            background: hovered
              ? `linear-gradient(90deg,${T.teal},${T.gold})`
              : "rgba(255,255,255,0.08)",
            transition: "background 0.4s",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FULL-WIDTH BANNER
───────────────────────────────────────────── */
function FullWidthBanner() {
  return (
    <section
      style={{
        position: "relative",
        height: "clamp(320px,50vw,600px)",
        overflow: "hidden",
      }}
    >
      <img
        src="/city.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.35) saturate(1.6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, rgba(59,191,191,0.35) 0%, rgba(232,115,42,0.45) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 clamp(20px,6vw,80px)",
          zIndex: 4,
        }}
      >
        <p
          className="reveal-up"
          style={{
            color: T.gold,
            fontFamily: T.mono,
            letterSpacing: "0.45em",
            fontSize: "clamp(0.6rem,1.2vw,0.8rem)",
            marginBottom: 16,
          }}
        >
          — PROBLEM SOLVER · OPEN SOURCE CONTRIBUTOR —
        </p>
        <h2
          className="reveal-up"
          style={{
            fontSize: "clamp(2.5rem,7vw,6rem)",
            color: "#fff",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            marginBottom: 28,
            textShadow: "2px 3px 0 rgba(0,0,0,0.5)",
          }}
        >
          Problem Solver
          <br />
          <span style={{ color: T.gold }}>by Practice</span>
          <br />
          Developer by Execution.
        </h2>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CATEGORIES GRID — FIX 3: CSS hover, memo, no useState
───────────────────────────────────────────── */
const cats = [
  {
    name: "Lokus AI",
    count: "PR #310",
    url: "https://github.com/lokus-ai/lokus/pull/310",
  },
  {
    name: "Lokus AI",
    count: "PR #414",
    url: "https://github.com/lokus-ai/lokus/pull/414",
  },
  {
    name: "Lokus AI",
    count: "PR #309",
    url: "https://github.com/lokus-ai/lokus/pull/309",
  },
  {
    name: "CPA to Cybersecurity",
    count: "PR #83",
    url: "https://github.com/CPAtoCybersecurity/csf_profile/pull/83",
  },
  {
    name: "CPA to Cybersecurity",
    count: "PR #88",
    url: "https://github.com/CPAtoCybersecurity/csf_profile/pull/88",
  },
];

function CategoriesGrid() {
  return (
    <section
      style={{
        background: T.dark,
        padding: "clamp(60px,8vw,110px) clamp(20px,5vw,60px)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="reveal-up"
          style={{ textAlign: "center", marginBottom: "clamp(32px,5vw,60px)" }}
        >
          <p
            style={{
              color: T.teal,
              fontFamily: T.mono,
              letterSpacing: "0.4em",
              fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
              marginBottom: 10,
            }}
          >
            — Issue solved
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem,5.5vw,4rem)",
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
          >
            Open source <span style={{ color: T.gold }}>contributions</span>
          </h2>
        </div>
        <div
          style={{
            marginLeft: "20px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(min(100%,180px),1fr))",
            gap: "clamp(10px,1.5vw,18px)",
          }}
        >
          {cats.map((c, i) => (
            <CategoryCard key={i} cat={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// memo = never re-renders unless props change. No useState = no re-render on hover.
const CategoryCard = memo(function CategoryCard({ cat, index }) {
  return (
    <a
      href={cat.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal-up cat-card"
      data-delay={index * 0.06}
    >
      <h3
        style={{
          color: T.gold,
          fontSize: "clamp(0.85rem,1.8vw,1.1rem)",
          letterSpacing: "0.06em",
          lineHeight: 1.3,
          margin: "0 8px 8px 8px",
        }}
      >
        {cat.name}
      </h3>
      <span
        className="cat-count"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontFamily: T.mono,
          fontSize: "clamp(0.55rem,1vw,0.68rem)",
          letterSpacing: "0.22em",
          transition: "color 0.25s",
        }}
      >
        {cat.count}
      </span>
    </a>
  );
});

/* ─────────────────────────────────────────────
   CONNECT
───────────────────────────────────────────── */
function Connect() {
  const socials = [
    {
      label: "GitHub",
      handle: "@Sarthak-Bhagat2006",
      url: "https://github.com/Sarthak-Bhagat2006",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      handle: "@Sarthak Bhagat",
      url: "https://www.linkedin.com/in/sarthak-bhagat-8984b9279/",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "LeetCode",
      handle: "@SarthakBhagt2006",
      url: "https://leetcode.com/u/SarthakBhagt2006/",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      handle: "@sarthak.bhagat_",
      url: "https://www.instagram.com/sarthak.bhagat_/",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      style={{
        background: T.gold,
        padding: "clamp(48px,7vw,96px) clamp(20px,6vw,80px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/city.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.08,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: T.mono,
            letterSpacing: "0.4em",
            fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
            marginBottom: 12,
            color: T.dark,
            opacity: 0.7,
          }}
        >
          — LET'S CONNECT
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem,5vw,3.8rem)",
            color: T.dark,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Follow the
          <br />
          Journey.
        </h2>
        <p
          style={{
            color: "rgba(13,13,13,0.65)",
            fontFamily: T.sans,
            fontSize: "clamp(0.85rem,1.5vw,1rem)",
            marginBottom: 48,
          }}
        >
          Building in public. Follow along for projects, contributions, and
          real-time updates.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "clamp(10px,1.5vw,16px)",
          }}
        >
          {socials.map((s, i) => (
            <SocialCard key={i} social={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialCard({ social }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "clamp(20px,3vw,32px) 16px",
        background: hovered ? T.dark : "rgba(13,13,13,0.08)",
        color: hovered ? T.gold : T.dark,
        border: `1.5px solid ${hovered ? T.dark : "rgba(13,13,13,0.18)"}`,
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(13,13,13,0.2)" : "none",
      }}
    >
      <span
        style={{ opacity: hovered ? 1 : 0.75, transition: "opacity 0.25s" }}
      >
        {social.icon}
      </span>
      <span
        style={{
          fontFamily: T.font,
          fontSize: "clamp(0.75rem,1.4vw,0.9rem)",
          letterSpacing: "0.1em",
          fontWeight: 600,
        }}
      >
        {social.label}
      </span>
      <span
        style={{
          fontFamily: T.mono,
          fontSize: "clamp(0.55rem,1vw,0.65rem)",
          letterSpacing: "0.15em",
          opacity: 0.55,
        }}
      >
        {social.handle}
      </span>
    </a>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS PAGE
───────────────────────────────────────────── */
function ProjectsPage() {
  const shoots = [
    {
      img: "/saarthi.png",
      name: "Personal AI-assistant",
      desc: "Built and deployed a full-stack AI assistant following SDLC practices, used by 200+ users, handling 1k+ daily API requests with JWT-secured APIs on a scalable backend architecture.",
      url: "https://saarthi-ai-assistant-frontend.vercel.app/",
    },
    {
      img: "/chargehub.png",
      name: "EV Charging Station Listing Platform",
      desc: "Developed a full-stack EV charging listing platform connecting private charger owners with users through interactive map-based discovery and pricing visibility.",
      url: "https://charge-hub-delta.vercel.app/listings",
    },
    {
      img: "/bullnest.png",
      name: "Real Time Stock Trading Simulator",
      desc: "Built a full-stack stock trading simulator handling real-time financial transactions with virtual currency, enabling users to buy/sell stocks and track their portfolio in real time.",
      url: "https://github.com/Sarthak-Bhagat2006/Bullnest-Trading-Simulator",
    },
  ];

  return (
    <div
      style={{
        paddingTop: "clamp(80px,12vw,130px)",
        background: T.dark,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "0 clamp(20px,5vw,60px)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,72px)" }}
        >
          <p
            style={{
              color: T.gold,
              fontFamily: T.mono,
              letterSpacing: "0.4em",
              fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
              marginBottom: 12,
            }}
          >
            —BUILDING FROM SCRATCH
          </p>
          <h1
            style={{
              fontSize: "clamp(3rem,8vw,7rem)",
              color: "#fff",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            <span style={{ color: T.gold }}>Projects</span>
          </h1>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(min(100%,300px),1fr))",
            gap: "clamp(12px,2vw,24px)",
          }}
        >
          {shoots.map((s, i) => (
            <ProjectsCard key={i} shoot={s} index={i} />
          ))}
        </div>
      </div>
      <MarqueeStrip />
    </div>
  );
}

function ProjectsCard({ shoot, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(shoot.url)}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.4s cubic-bezier(.16,1,.3,1)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}
    >
      <img
        src={shoot.img}
        alt={shoot.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.08)" : "scale(1.02)",
          transition: "transform 0.6s ease",
          filter: hovered
            ? "brightness(0.4) saturate(1.5)"
            : "brightness(0.75) saturate(1.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(16px,3vw,28px)",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
        }}
      >
        <h3
          style={{
            color: "#fff",
            fontSize: "clamp(1.1rem,2.5vw,1.6rem)",
            letterSpacing: "0.02em",
            marginBottom: 4,
          }}
        >
          {shoot.name}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: T.mono,
              fontSize: "clamp(0.55rem,1vw,0.68rem)",
              letterSpacing: "0.22em",
            }}
          >
            Live
          </span>
          <span
            style={{
              color: hovered ? T.gold : "rgba(255,255,255,0.4)",
              fontFamily: T.mono,
              fontSize: "clamp(0.55rem,1vw,0.68rem)",
              letterSpacing: "0.22em",
              transition: "color 0.25s",
            }}
          >
            VIEW →
          </span>
        </div>
        <div
          style={{
            height: 1,
            background: hovered
              ? `linear-gradient(90deg,${T.teal},${T.gold})`
              : "rgba(255,255,255,0.1)",
            marginTop: 10,
            transition: "background 0.4s",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
function AboutPage() {
  return (
    <div
      style={{
        paddingTop: "clamp(80px,12vw,130px)",
        background: T.dark,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "clamp(300px,45vw,520px)",
          overflow: "hidden",
          marginBottom: "clamp(60px,8vw,100px)",
        }}
      >
        <img
          src="/city.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.35) saturate(1.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, rgba(59,191,191,0.3) 0%, rgba(232,115,42,0.35) 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: T.gold,
              fontFamily: T.mono,
              letterSpacing: "0.4em",
              fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
              marginBottom: 14,
            }}
          >
            — MY STORY
          </p>
          <h1
            style={{
              fontSize: "clamp(3rem,8vw,7rem)",
              color: "#fff",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            Code Born.
            <br />
            <span style={{ color: T.gold }}>Builder Made.</span>
          </h1>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(20px,5vw,60px) clamp(60px,8vw,100px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(32px,6vw,80px)",
            marginBottom: "clamp(60px,8vw,100px)",
          }}
        >
          <div style={{ flex: "1 1 300px" }}>
            <h2
              style={{
                fontSize: "clamp(1.8rem,4.5vw,3.2rem)",
                color: "#fff",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              I don't just
              <br />
              <span style={{ color: T.gold }}>learn.</span>
              <br />I build.
            </h2>
          </div>
          <div style={{ flex: "1 1 300px" }}>
            {[
              "Pre-final year ECE student obsessed with real-time systems and full-stack development.",
              "MERN stack developer who ships production-ready code, contributes to open source, and solves 400+ DSA problems.",
              "Every project is a system. Every bug is a lesson. Every deploy is a win.",
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: T.sans,
                  fontSize: "clamp(0.9rem,1.6vw,1.05rem)",
                  lineHeight: 1.75,
                  marginBottom: 18,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────── */
function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    msg: "",
  });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div
      style={{
        paddingTop: "clamp(80px,12vw,130px)",
        background: T.dark,
        minHeight: "100vh",
        padding:
          "clamp(80px,12vw,130px) clamp(20px,5vw,60px) clamp(60px,8vw,100px)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,72px)" }}
        >
          <p
            style={{
              color: T.gold,
              fontFamily: T.mono,
              letterSpacing: "0.4em",
              fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
              marginBottom: 12,
            }}
          >
            — GET IN TOUCH
          </p>
          <h1
            style={{
              fontSize: "clamp(3rem,7vw,6rem)",
              color: "#fff",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            Say <span style={{ color: T.gold }}>What's Up.</span>
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(32px,6vw,80px)",
          }}
        >
          <div style={{ flex: "1 1 260px" }}>
            {[
              {
                icon: "ri-mail-line",
                label: "Email",
                val: "sarthakbhagat2006@gmail.com",
              },
              { icon: "ri-map-pin-line", label: "Location", val: "India" },
              {
                icon: "ri-time-line",
                label: "Response",
                val: "Within 24 hours",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 28,
                  paddingBottom: 24,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <i
                  className={item.icon}
                  style={{ color: T.gold, fontSize: "1.4rem", marginTop: 2 }}
                />
                <div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: T.mono,
                      fontSize: "clamp(0.55rem,1vw,0.68rem)",
                      letterSpacing: "0.22em",
                      marginBottom: 4,
                    }}
                  >
                    {item.label.toUpperCase()}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: T.sans,
                      fontSize: "clamp(0.85rem,1.4vw,0.95rem)",
                    }}
                  >
                    {item.val}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: "1 1 320px" }}>
            {sent ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "clamp(40px,6vw,72px)",
                  border: `1px solid rgba(245,200,66,0.25)`,
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>✓</div>
                <h3
                  style={{
                    color: T.gold,
                    fontSize: "clamp(1.2rem,2.5vw,1.8rem)",
                    marginBottom: 10,
                  }}
                >
                  Message sent!
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontFamily: T.sans,
                  }}
                >
                  I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  { key: "name", placeholder: "Your Name", type: "text" },
                  { key: "email", placeholder: "Your Email", type: "email" },
                  { key: "subject", placeholder: "Subject", type: "text" },
                ].map((f) => (
                  <input
                    key={f.key}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={set(f.key)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      padding: "clamp(12px,2vw,16px) clamp(14px,2vw,18px)",
                      fontFamily: T.sans,
                      fontSize: "clamp(0.82rem,1.4vw,0.95rem)",
                      outline: "none",
                      transition: "border-color 0.25s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.gold)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                    }
                  />
                ))}
                <textarea
                  placeholder="Your Message"
                  value={form.msg}
                  onChange={set("msg")}
                  rows={5}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    padding: "clamp(12px,2vw,16px) clamp(14px,2vw,18px)",
                    fontFamily: T.sans,
                    fontSize: "clamp(0.82rem,1.4vw,0.95rem)",
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.25s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = T.gold)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <GoldBtn
                  onClick={() => {
                    if (form.name && form.email) setSent(true);
                  }}
                >
                  Send Message →
                </GoldBtn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REUSABLE BUTTONS
───────────────────────────────────────────── */
function GoldBtn({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? T.orange : T.gold,
        color: T.dark,
        border: "none",
        padding: "clamp(11px,1.8vw,15px) clamp(22px,3.5vw,38px)",
        fontFamily: T.font,
        fontSize: "clamp(0.7rem,1.3vw,0.85rem)",
        letterSpacing: "0.14em",
        cursor: "pointer",
        transition: "background 0.22s, transform 0.18s",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h ? `0 8px 28px rgba(245,200,66,0.35)` : "none",
      }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { overscroll-behavior: none; }
  img  { -webkit-user-drag: none; user-select: none; }
  button { -webkit-tap-highlight-color: transparent; }
  ::selection { background: rgba(245,200,66,0.35); color: #000; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0d0d0d; }
  ::-webkit-scrollbar-thumb { background: #F5C842; border-radius: 2px; }

  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(7px); }
  }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .marquee-track { animation: marquee 20s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  @media (max-width: 640px) {
    .nav-links-desktop { display: none !important; }
    .nav-cta           { display: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
