import { useRef, useState, useEffect, memo } from "react";
import React from "react";

function WhatIDo() {
  const items = [
    {
      title: "Full Stack Development",
      desc: "Building scalable MERN applications with clean architecture and production-ready practices.",
    },
    {
      title: "Real-Time Systems",
      desc: "Designing systems with live data, WebSockets, and event-driven architecture.",
    },
    {
      title: "Problem Solving",
      desc: "Solved 400+ DSA problems with strong fundamentals in algorithms and data structures.",
    },
  ];

  return (
    <section
      style={{
        background: "#0f0f0f",
        padding: "clamp(60px,8vw,110px) clamp(20px,6vw,80px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2
          className="reveal-up"
          style={{
            textAlign: "center",
            fontSize: "clamp(2rem,5vw,3.5rem)",
            color: "#fff",
            marginBottom: "clamp(40px,6vw,70px)",
          }}
        >
          What I <span style={{ color: "#F5C842" }}>Do</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 24,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="reveal-up"
              data-delay={i * 0.1}
              style={{
                padding: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <h3 style={{ color: "#F5C842", marginBottom: 10 }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatIDo;
