import * as React from "react"
import Layout from "../components/Layout"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { siteMetadata } from "../../gatsby-config"
import RecentArticles from "../components/RecentPosts"

export const query = graphql`
  query TCA {
    file(relativePath: {eq: "tca.png"}) {
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
        <section>
          <div className="flex-column"><GatsbyImage image={tca_logo} /></div>
          <h1 className="mb-4">Welcome!</h1>
          <p>{siteMetadata.description}</p>
        </section>
        <section>
          <RecentArticles />
        </section>
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>Home | TCA Journal</title>