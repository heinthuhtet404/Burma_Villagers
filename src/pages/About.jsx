export default function About() {
  return (
    <section className="about">
      <div className="container">
        {/* Head */}
        <header className="about-head">
          <p className="section-eyebrow">ABOUT</p>
          <h1 className="about-title">
            BURMA
            <br />
            VILLAGERS.
          </h1>
        </header>

        {/* Statement */}
        <div className="about-block">
          <p className="about-lead">
            Simple pieces for the way we live.
          </p>
          <p className="about-body">
            Burma Villagers is a Myanmar clothing label built around
            everyday wear. We make heavy-weight essentials with a clean,
            structured feel — no excess, no noise.
          </p>
        </div>

        {/* 350 GSM highlight */}
        <div className="about-block about-block--split">
          <div>
            <p className="section-eyebrow">THE FABRIC</p>
            <h2 className="about-sub">350 GSM</h2>
          </div>
          <p className="about-body">
            A heavier-weight fabric designed for a structured, substantial
            feel. Built to hold shape, wear in, and last.
          </p>
        </div>

        {/* Principles */}
        <div className="about-principles">
          <div className="about-principle">
            <p className="about-principle-num">01</p>
            <p className="about-principle-title">HEAVY</p>
            <p className="about-principle-text">
              Weight you can feel.
            </p>
          </div>
          <div className="about-principle">
            <p className="about-principle-num">02</p>
            <p className="about-principle-title">CLEAN</p>
            <p className="about-principle-text">
              Nothing extra.
            </p>
          </div>
          <div className="about-principle">
            <p className="about-principle-num">03</p>
            <p className="about-principle-title">EVERYDAY</p>
            <p className="about-principle-text">
              Made to be worn.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="about-cta">
          <p className="section-eyebrow">GET IN TOUCH</p>
          <h2 className="about-cta-title">
            Follow the villagers.
          </h2>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            FOLLOW ON TIKTOK →
          </a>
        </div>
      </div>
    </section>
  );
}