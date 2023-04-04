import * as React from "react"
import Layout from "../components/Layout"
import { Link } from "gatsby"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export const query = graphql`
  query TCA {
    file(relativePath: {eq: "pagenotfound_error404.png"}) {
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

const NotFoundPage = ({data}) => {
  const notfound = getImage(data.file.childImageSharp.gatsbyImageData)
  return (
    <Layout>
      <main>
        <section>
          <div className="flex-column"><GatsbyImage image={notfound} /></div>
          <h1>Page Not Found</h1>
          <h3>Click <Link to="/">here</Link> to go back</h3>
        </section>
      </main>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => <title>Not found</title>