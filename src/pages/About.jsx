import { useEffect, useRef } from "react";

const LINE_1 = "BURMA".split("");
const LINE_2 = "VILLAGERS".split("");

function AboutHead() {
  const headRef = useRef(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entries]) => {
        if (entries.isIntersecting) el.classList.add("is-revealed");
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header className="about-type container" ref={headRef}>
      {/* ---------- eyebrow ---------- */}
      <p className="about-type-eyebrow">
        <span className="about-dot" />
        ABOUT — EST. 2026
        <span className="about-type-eyebrow-rule" />
        <span className="about-type-eyebrow-side">KANAUNG · MM</span>
      </p>

      {/* ---------- the title ---------- */}
      <h1 className="about-type-title">
        {/* Line 1 — outline */}
        <span className="about-type-line about-type-line--outline">
          {LINE_1.map((ch, i) => (
            <span
              key={`l1-${i}`}
              className="about-type-letter"
              style={{ "--i": i }}
            >
              {ch}
            </span>
          ))}
        </span>

        {/* Line 2 — filled + accent dot */}
        <span className="about-type-line about-type-line--fill">
          {LINE_2.map((ch, i) => (
            <span
              key={`l2-${i}`}
              className="about-type-letter"
              style={{ "--i": i + LINE_1.length }}
            >
              {ch}
            </span>
          ))}
          <span
            className="about-type-dot"
            style={{ "--i": LINE_2.length + LINE_1.length }}
          >
            .
          </span>
        </span>
      </h1>

      {/* ---------- sub text + meta ---------- */}
      <div className="about-type-foot">
        <p className="about-type-sub">
          Simple pieces for the way we live.
        </p>

        <div className="about-type-meta">
          <span className="about-type-meta-item">16.8409° N / 96.1247° E</span>
          <span className="about-type-meta-item">GMT +6:30</span>
          <span className="about-type-meta-item">VOL. 01</span>
        </div>
      </div>
    </header>
  );
}

export default function About() {
  return (
    <section className="about">
      {/* HEADER — typographic hero */}
      <AboutHead />

      {/* STATEMENT — split */}
      <div className="about-statement container">
        <div className="about-statement-lead">
          <p className="about-lead">
            Simple pieces for
            <br />
            the way we live.
          </p>
        </div>

        <div className="about-statement-body">
          <p className="about-body">
            Burma Villagers is a Myanmar clothing label built around
            everyday wear. We make heavy-weight essentials with a clean,
            structured feel — no excess, no noise.
          </p>
        </div>
      </div>

      {/* 350 GSM — magazine spread */}
      <div className="about-fabric">
        <div className="container about-fabric-inner">
          <div className="about-fabric-left">
            <p className="section-eyebrow">THE FABRIC</p>
            <h2 className="about-sub">
              350
              <br />
              GSM
            </h2>
          </div>

          <div className="about-fabric-right">
            <p className="about-fabric-body">
              A heavier-weight fabric designed for a structured,
              substantial feel. Built to hold shape, wear in, and last.
            </p>

            <div className="about-fabric-specs">
              <div className="about-spec">
                <span className="about-spec-key">WEIGHT</span>
                <span className="about-spec-val">350 GSM</span>
              </div>
              <div className="about-spec">
                <span className="about-spec-key">FABRIC</span>
                <span className="about-spec-val">AIR LAYER</span>
              </div>
              <div className="about-spec">
                <span className="about-spec-key">FIT</span>
                <span className="about-spec-val">STRUCTURED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINCIPLES — brutalist grid */}
      <div className="about-principles container">
        <div className="about-principle">
          <span className="about-principle-num">01</span>
          <h3 className="about-principle-title">HEAVY</h3>
          <p className="about-principle-text">Weight you can feel.</p>
        </div>

        <div className="about-principle">
          <span className="about-principle-num">02</span>
          <h3 className="about-principle-title">CLEAN</h3>
          <p className="about-principle-text">Nothing extra.</p>
        </div>

        <div className="about-principle">
          <span className="about-principle-num">03</span>
          <h3 className="about-principle-title">EVERYDAY</h3>
          <p className="about-principle-text">Made to be worn.</p>
        </div>
      </div>

      {/* CTA — full-width brutalist */}
      <div className="about-cta-wrap">
        <div className="container about-cta">
          <p className="section-eyebrow">GET IN TOUCH</p>
          <h2 className="about-cta-title">
            Follow the
            <br />
            villagers.
          </h2>
          <a
            href="https://www.tiktok.com/@burma.villagers?_r=1&_t=ZS-9AnaUZa0hfw"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary about-cta-btn"
          >
            <span>FOLLOW ON TIKTOK</span>
            <span className="about-cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}