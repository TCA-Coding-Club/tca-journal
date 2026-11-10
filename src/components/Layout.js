import * as React from "react"
import { Link } from "gatsby"
import { siteMetadata } from "../../gatsby-config"
import logo from "../images/tcalogo.png"
import {
  motionOK,
  createReveal,
  createTilt,
  createParallax,
  createFloat,
  createHeaderShadow,
  createProgress,
} from "../utils/motion"

// `progressTarget` (optional): a ref to the element whose reading progress
// fills the thin bar on the bottom edge of the sticky header (article page).
const Layout = ({ children, progressTarget }) => {
  const headerRef = React.useRef(null)
  const barRef = React.useRef(null)
  const revealRef = React.useRef(null)

  // Page-wide motion. Everything here touches window/document, so it only
  // runs in the browser, after mount, and is torn down on unmount.
  React.useEffect(() => {
    const offs = [createHeaderShadow(headerRef.current)]
    if (motionOK()) {
      revealRef.current = createReveal()
      revealRef.current.scan()
      offs.push(createTilt(), createParallax(), createFloat())
    }
    return () => {
      offs.forEach(off => { try { off() } catch (e) { /* ignore */ } })
      if (revealRef.current) { revealRef.current.destroy(); revealRef.current = null }
      document.querySelectorAll("[data-parallax]").forEach(el => { el.style.transform = "" })
    }
  }, [])

  // Pick up [data-reveal] elements added by later renders (e.g. filtered results).
  React.useEffect(() => {
    if (!revealRef.current) return undefined
    const raf = requestAnimationFrame(() => revealRef.current && revealRef.current.scan())
    return () => cancelAnimationFrame(raf)
  })

  React.useEffect(() => {
    if (!progressTarget) return undefined
    return createProgress(barRef.current, progressTarget.current)
  }, [progressTarget])

  return (
    <div className="site">
      <div className="utilbar no-print">
        <div className="wrap">
          <span>The Collegiate Academy · Goyang, South Korea</span>
          <span className="right">Open Access · Est. 2023</span>
        </div>
      </div>

      <header className="masthead no-print" ref={headerRef}>
        <div className="wrap">
          <Link to="/" className="brand">
            <img src={logo} alt="The Collegiate Academy" />
            <span className="brand-titles">
              <span className="brand-title">The Collegiate Academy Journal</span>
              <span className="brand-tag">Student research &amp; writing across the arts, sciences, and society</span>
            </span>
          </Link>
          <nav className="nav">
            <Link to="/" activeClassName="active">Home</Link>
            <Link to="/journal" activeClassName="active" partiallyActive={true}>Journal</Link>
            <Link to="/about" activeClassName="active">About</Link>
          </nav>
        </div>
        {progressTarget && (
          <div className="progress-track">
            <div className="progress-bar" ref={barRef} />
          </div>
        )}
      </header>

      {children}

      <footer className="site-footer no-print">
        <div className="wrap cols">
          <div>
            <div className="footer-brand">
              <img src={logo} alt="" />
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
