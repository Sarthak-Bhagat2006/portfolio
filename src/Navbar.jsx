import { useRef, useState, useEffect, memo } from "react";
import React from "react";

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

function Navbar({ activePage, setActivePage }) {
  const [open, setOpen] = useState(false);
  const links = ["home", "projects", "about", "contact"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "clamp(14px,3vw,28px) clamp(16px,5vw,48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background:
          "linear-gradient(to bottom,rgba(0,0,0,0.65) 0%,transparent 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          className="ham-btn"
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: i === 1 ? 26 : 36,
                height: 2,
                background: "#fff",
                transition: "all 0.3s",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      <div
        className="nav-links-desktop"
        style={{ display: "flex", gap: "clamp(18px,3vw,40px)" }}
      >
        {links.map((l) => (
          <button
            key={l}
            onClick={() => setActivePage(l)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: activePage === l ? T.gold : "rgba(255,255,255,0.75)",
              fontFamily: T.font,
              fontSize: "clamp(0.65rem,1.2vw,0.82rem)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              transition: "color 0.25s",
              borderBottom:
                activePage === l
                  ? `2px solid ${T.gold}`
                  : "2px solid transparent",
              paddingBottom: 2,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
            onMouseLeave={(e) => {
              if (activePage !== l)
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <button
        className="nav-cta"
        style={{
          background: T.gold,
          color: T.dark,
          border: "none",
          padding: "8px 20px",
          fontFamily: T.font,
          fontSize: "clamp(0.6rem,1.1vw,0.75rem)",
          letterSpacing: "0.18em",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = T.orange)}
        onMouseLeave={(e) => (e.currentTarget.style.background = T.gold)}
        onClick={() => window.open("https://github.com/Sarthak-Bhagat2006")}
      >
        GitHub
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,13,13,0.97)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "2rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          {links.map((l, i) => (
            <button
              key={l}
              onClick={() => {
                setActivePage(l);
                setOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activePage === l ? T.gold : "#fff",
                fontFamily: T.font,
                fontSize: "clamp(1.8rem,7vw,3rem)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0,
                animation: `fadeInUp 0.5s ease ${i * 0.08}s forwards`,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
