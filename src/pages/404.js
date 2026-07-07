import * as React from "react"
import Layout from "../components/Layout"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export const query = graphql`
  query TCA {
    file(relativePath: {eq: "pagenotfound_error404.png"}) {
      childImageSharp {
        gatsbyImageData(width: 500, placeholder: BLURRED, formats: [AUTO, WEBP])
      }
    }
  }
`

const NotFoundPage = ({ data }) => {
  const notfound = getImage(data.file.childImageSharp.gatsbyImageData)
  return (
    <Layout>
      <div className="center-state">
        <GatsbyImage image={notfound} alt="" />
        <h1>Page Not Found</h1>
        <p><Link to="/" className="back-link">← Return to Home</Link></p>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => <title>Not found — TCA Journal</title>
