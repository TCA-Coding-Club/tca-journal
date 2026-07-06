import * as React from "react"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { siteMetadata } from "../../gatsby-config"
import RecentArticles from "../components/RecentArticles"
import { Link } from "gatsby"

export const query = graphql`
  query TCA {
    file(relativePath: {eq: "tcalogo.png"}) {
      childImageSharp {
        gatsbyImageData(
          width: 500
          placeholder: BLURRED
          formats: [AUTO, WEBP]
          )
      }
    }
  }
`

const IndexPage = ({data}) => {
  const tca_logo = getImage(data.file.childImageSharp.gatsbyImageData)
  
  return (
    <Layout>
      <main>
        <section className="hero">
          <div className="flex-column"><GatsbyImage image={tca_logo} /></div>
          <h1 className="mb-4">Welcome to the TCA Journal</h1>
          <p>{siteMetadata.description}</p>
          <p className="lead-cta"><Link to="/journal">Browse the full journal</Link> to read every article.</p>
        </section>
        <section>
          <RecentArticles />
        </section>
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>Home</title>