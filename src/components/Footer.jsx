import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">BURMA VILLAGERS</p>
          <p className="footer-tag">Made for everyday.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-title">SHOP</p>
            <Link to="/shop">All Products</Link>
            <Link to="/shop">New Drop</Link>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">ABOUT</p>
            <Link to="/about">Our Story</Link>
            <Link to="/about">Contact</Link>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">FOLLOW</p>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} BURMA VILLAGERS</p>
        <p>MMK · Myanmar</p>
      </div>
    </footer>
  );
}