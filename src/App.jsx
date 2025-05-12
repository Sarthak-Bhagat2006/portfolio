import { useRef, useState } from "react";
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

function App() {
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef(null);

  // Animation for UT Mask
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".ut-mask-group", {
      rotate: 10,
      ease: "power4.easeInOut",
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
        const svgEl = document.querySelector(".svg");
        if (svgEl) {
          setTimeout(() => {
            svgEl.remove();
            setShowContent(true);
          }, 100); // Delay 100ms
        }
      },
    });
  }, []);

  // Mouse move animation on images
  useGSAP(
    () => {
      if (!showContent) return;

      gsap.to(".main", {
        scale: 1,
        rotate: 0,
        duration: 2,
        delay: -1,
        ease: "Expo.easeInOut",
      });
      gsap.to(".sky", {
        scale: 1.1,
        rotate: 0,
        duration: 2,
        delay: -0.8,
        ease: "Expo.easeInOut",
      });
      gsap.to(".city", {
        scale: 1.1,
        rotate: 0,
        duration: 2,
        delay: -0.8,
        ease: "Expo.easeInOut",
      });

      gsap.to(".girlbg", {
        scale: 0.49,
        x: "-50%",
        rotate: 0,
        duration: 2,
        delay: -0.8,
        ease: "Expo.easeInOut",
      });
      gsap.to(".text", {
        scale: 1,
        bottom: "-25%",
        rotate: 0,
        duration: 2,
        delay: -0.8,
        ease: "Expo.easeInOut",
      });

      const handleMove = (e) => {
        const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
        gsap.to(".imagesdiv .text", {
          x: `${xMove * 0.4}%`,
        });
        gsap.to(".sky", {
          x: xMove,
        });
        gsap.to(".city", {
          x: xMove * 1.7,
        });
      };

      const main = mainRef.current;
      if (main) {
        main.addEventListener("mousemove", handleMove);
      }

      return () => {
        if (main) {
          main.removeEventListener("mousemove", handleMove);
        }
      };
    },
    { dependencies: [showContent] }
  );

  return (
    <>
      {/* Splash Screen */}
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-black">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="utMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="ut-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  UT
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
        </svg>
      </div>

      {/* Main Content */}
      {showContent && (
        <div
          ref={mainRef}
          className="main w-full bg-black rotate-[-10deg] scale-[1.7]"
        >
          <div className="landing w-full h-screen bg-black relative">
            {/* Navbar */}
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-10 px-10">
              <div className="logo flex gap-7">
                <div className="lines flex flex-col gap-1">
                  <div className="line w-10 h-1 bg-white"></div>
                  <div className="line w-10 h-1 bg-white"></div>
                  <div className="line w-10 h-1 bg-white"></div>
                </div>
                <h3 className="text-xl text-white -mt-1">Urban Thread</h3>
              </div>
            </div>

            {/* Hero Images */}
            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              <img
                className="absolute sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="/sky.png"
                alt=""
              />
              <img
                className="absolute city scale-[1.8] rotate-[-25deg] top-0 left-0 w-full h-full object-cover"
                src="/city.png"
                alt=""
              />
              <div className="text text-white absolute top-10 left-1/2 -translate-x-1/2 text-center scale-[1.4] rotate-[-10deg]">
                <h1 className="text-[6rem] leading-none -ml-40">urban</h1>
                <h1 className="text-[5rem]  ">thread</h1>
                <h1 className="text-[6rem] leading-none -ml-40">clothing</h1>
              </div>
              <img
                className="absolute girlbg -bottom-[80%] scale-[1] rotate-[-10deg] left-1/2 -translate-x-1/2"
                src="/girlbg.png"
                alt=""
              />
            </div>

            {/* Bottom Bar */}
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-10 px-10 bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-4 items-center justify-center">
                <i className="ri-arrow-down-fill text-xl"></i>
                <h3 className="font-[Helvetica_Now_display]">Scroll Down</h3>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full h-screen px-10 bg-black flex items-center justify-center">
            <div className="cntnr w-full h-[80%] flex text-white gap-20">
              <div className="limg relative w-1/2 h-full">
                <img
                  className="absolute scale-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-10"
                  src="/image3.png"
                  alt=""
                />
              </div>
              <div className="rimg w-[30%] mt-20">
                <h1 className="text-5xl">Street Born</h1>
                <h1 className="text-4xl">Built for the Bold</h1>
                <p className="mt-10 text-xl font-[Helvetica_Now_display]">
                  This isn’t just fashion — it’s your daily flex. Urban Thread
                  is where street culture collides with raw attitude.
                </p>
                <p className="mt-3 text-xl font-[Helvetica_Now_display]">
                  Designed for the ones who scroll fast, talk loud, and move
                  harder. We keep it oversized, overstyled, and always
                  underground.
                </p>
                <p className="mt-3 text-xl font-[Helvetica_Now_display]">
                  You weren’t made to blend in. So why should your fit?
                </p>
                <button className="bg-yellow-500 px-7 py-3 text-2xl text-black mt-10">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
