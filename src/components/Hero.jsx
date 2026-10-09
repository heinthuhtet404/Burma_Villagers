import { Link } from "react-router-dom";
import heroImg from "../images/hero.jpg";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        {/* Text side */}
        <div className="hero-text">
          <p className="hero-eyebrow">350 GSM AIR LAYER — PLAIN COLLECTION</p>

          <h1 className="hero-title">
            BUILT FOR
            <br />
            EVERYDAY.
          </h1>

          <p className="hero-sub">
            Heavy feel. Clean look. Everyday wear.
          </p>

          <Link to="/shop" className="btn btn-primary hero-cta">
            SHOP THE DROP →
          </Link>
        </div>

        {/* Image side */}
        <div className="hero-image">
          <img src={heroImg} alt="350 GSM Air Layer Tee" />
        </div>
      </div>
    </section>
  );
}