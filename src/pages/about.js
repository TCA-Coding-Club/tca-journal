import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import { graphql } from "gatsby"

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

const About = ({data}) => {
    const tca_logo = getImage(data.file.childImageSharp.gatsbyImageData)

    return (
        <Layout>
            <main>
                <section>
                    <div className="flex-column"><GatsbyImage image={tca_logo} /></div>
                    <h1 className="mb-4">About</h1>
                    <p><mark><a href="https://www.thecollegiateacademy.net/" target="_blank">The Collegiate Academy (TCA)</a></mark> is an international school in Goyang, South Korea. This is where monthly articles authored by TCA students are uploaded. Developed by TCA's coding club, the website is continually adding new features. Please don't hesitate to reach out with any suggestions or bug reports via email at <ins>wonseunghyun248@gmail.com</ins></p>
                    <p>You can access this website's source code <a href="https://github.com/ws-h842/tca-journal" target="_blank">here</a>.</p>
                </section>
            </main>
        </Layout>
    )
}

export default About

export const Head = () => <title>About</title>