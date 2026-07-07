import * as React from "react"
import { Link } from "gatsby"
import { siteMetadata } from "../../gatsby-config"
import logo from "../images/tcalogo.png"

// `search` (optional): {value, onChange} — the Journal page passes this to show
// a compact search input in the masthead.
const Layout = ({ children, search }) => {
  return (
    <div className="site">
      <div className="utilbar no-print">
        <div className="wrap">
          <span className="left">The Collegiate Academy · Goyang, South Korea</span>
          <span className="right">Open Access · Est. 2023</span>
        </div>
      </div>

      <header className="masthead no-print">
        <div className="wrap">
          <Link to="/" className="masthead-brand">
            <img src={logo} alt="The Collegiate Academy" />
            <span className="masthead-titles">
              <span className="masthead-title">The Collegiate Academy Journal</span>
              <span className="masthead-tag">Student research &amp; writing across the arts, sciences, and society</span>
            </span>
          </Link>
          <div className="masthead-right">
            <ul className="masthead-nav">
              <li><Link to="/" activeClassName="active">Home</Link></li>
              <li><Link to="/journal" activeClassName="active" partiallyActive={true}>Journal</Link></li>
              <li><Link to="/about" activeClassName="active">About</Link></li>
            </ul>
            {search && (
              <div className="masthead-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a716a" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></svg>
                <input
                  value={search.value}
                  onChange={search.onChange}
                  placeholder="Search articles"
                  aria-label="Search articles"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer no-print">
        <div className="wrap cols">
          <div>
            <div className="footer-brand">
              <span className="footer-crest"><img src={logo} alt="" /></span>
              <span className="footer-wordmark">The Collegiate Academy Journal</span>
            </div>
            <p className="blurb">
              An open-access, student-run journal from The Collegiate Academy in Goyang,
              South Korea. Built and maintained by the TCA Coding Club.
            </p>
          </div>
          <div>
            <div className="footer-h">Explore</div>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/journal">Journal Archive</Link>
              <Link to="/leaderboard">Most Viewed</Link>
              <Link to="/about">About</Link>
            </div>
          </div>
          <div>
            <div className="footer-h">Contact</div>
            <div className="footer-links">
              <a href="mailto:ddidolyi@gmail.com">ddidolyi@gmail.com</a>
              <a href="https://www.thecollegiateacademy.net/" target="_blank" rel="noreferrer">thecollegiateacademy.net</a>
            </div>
          </div>
        </div>
        <div className="footer-legal">
          <div className="wrap">{siteMetadata.copyright}</div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
