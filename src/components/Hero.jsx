import { Link } from "react-router-dom";
import heroImg from "../images/hero.jpg";
import SplitText from "./SplitText";
import useMagnetic from "../hooks/useMagnetic";

export default function Hero() {
  const ctaRef = useMagnetic({
    strength: 0.4,
    radius: 120,
    cursorPull: 0.15,
  });

  return (
    <section className="hero">
      <div className="container hero-inner">

        
        {/* Text side */}
        <div className="hero-text">
          <p className="hero-eyebrow">350 GSM AIR LAYER — PLAIN COLLECTION</p>

          <h1 className="hero-title">
            <SplitText text={"BUILT FOR\nEVERYDAY."} delay={140} stagger={38} />
          </h1>

          <p className="hero-sub">
            Heavy feel. Clean look. Everyday wear.
          </p>

          <div ref={ctaRef} className="hero-cta-wrap" data-cursor="SHOP →">
            <Link to="/shop" className="btn btn-primary hero-cta">
              SHOP THE DROP →
            </Link>
          </div>
        </div>

        {/* Image side */}
        <div className="hero-image" data-cursor="350 GSM">
          <div className="hero-image-inner">
            <img src={heroImg} alt="350 GSM Air Layer Tee" />
          </div>
        </div>
      </div>
    </section>
  );
}