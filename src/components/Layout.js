import * as React from "react"
import { Link } from "gatsby"
import { siteMetadata } from "../../gatsby-config"

const Layout = ({children}) => {
  return (
    <div className="container">
      <nav className="">
        <ul>
          <li><h1>{siteMetadata.title}</h1></li>
        </ul>
        <ul>
          <li><Link to="/" className="bt-border-hov">Home</Link></li>
          <li><Link to="/journal" className="bt-border-hov">Journal</Link></li>
          <li><Link to="/about" className="bt-border-hov">About</Link></li>
        </ul>
      </nav>
      <section className="container">
        {children}
      </section>
      <footer className="contrast">
        <p>{siteMetadata.copyright}</p>
      </footer>
    </div>
  )
}

export default Layout