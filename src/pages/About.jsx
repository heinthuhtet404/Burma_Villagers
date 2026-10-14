export default function About() {
  return (
    <section className="about">
      {/* ============================================
          HEADER — giant editorial title
          ============================================ */}
      <header className="about-head container">
        <p className="section-eyebrow">
          <span className="about-dot" />
          ABOUT — EST. 2026
        </p>

        <h1 className="about-title">
          <span className="about-title-line about-title-line--outline">
            BURMA
          </span>
          <span className="about-title-line">
            VILLAGERS
            <span className="about-title-dot">.</span>
          </span>
        </h1>

        <div className="about-head-meta">
          <span>KANAUNG · MM</span>
          <span>16.8409° N</span>
          <span>GMT +6:30</span>
        </div>
      </header>

      {/* ============================================
          STATEMENT — split
          ============================================ */}
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

      {/* ============================================
          350 GSM — magazine spread
          ============================================ */}
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

      {/* ============================================
          PRINCIPLES — brutalist grid
          ============================================ */}
      <div className="about-principles container">
        <div className="about-principle">
          <span className="about-principle-num">01</span>
          <h3 className="about-principle-title">HEAVY</h3>
          <p className="about-principle-text">
            Weight you can feel.
          </p>
        </div>

        <div className="about-principle">
          <span className="about-principle-num">02</span>
          <h3 className="about-principle-title">CLEAN</h3>
          <p className="about-principle-text">
            Nothing extra.
          </p>
        </div>

        <div className="about-principle">
          <span className="about-principle-num">03</span>
          <h3 className="about-principle-title">EVERYDAY</h3>
          <p className="about-principle-text">
            Made to be worn.
          </p>
        </div>
      </div>

      {/* ============================================
          CTA — full-width brutalist
          ============================================ */}
      <div className="about-cta-wrap">
        <div className="container about-cta">
          <p className="section-eyebrow">GET IN TOUCH</p>
          <h2 className="about-cta-title">
            Follow the
            <br />
            villagers.
          </h2>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary about-cta-btn"
          >
            <span>FOLLOW ON TIKTOK</span>
            <span className="about-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}