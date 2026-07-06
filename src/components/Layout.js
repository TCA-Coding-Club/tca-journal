import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { siteMetadata } from "../../gatsby-config"

const Layout = ({children}) => {
  const data = useStaticQuery(graphql`
    query MastheadLogo {
      file(relativePath: {eq: "tcalogo.png"}) {
        childImageSharp {
          gatsbyImageData(width: 92, placeholder: BLURRED, formats: [AUTO, WEBP])
        }
      }
    }
  `)
  const logo = getImage(data.file.childImageSharp.gatsbyImageData)

  return (
    <div className="container">
      <nav className="masthead">
        <Link to="/" className="masthead-brand">
          <GatsbyImage className="masthead-logo" image={logo} alt="TCA Journal" />
          <span className="masthead-titles">
            <span className="masthead-title">{siteMetadata.title}</span>
            <span className="masthead-tagline">Student research &amp; writing from The Collegiate Academy</span>
          </span>
        </Link>
        <ul className="masthead-nav">
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
