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
                    <p><mark><a href="https://www.thecollegiateacademy.net/" target="_blank">The Collegiate Academy (TCA)</a></mark> is an international school located in Goyang, South Korea. This website is where monthly journal articles of TCA students are uploaded.</p>
                    <p>This website was created and is run by TCA's coding club. We are still updating and adding new features to the website, so we are open to hearing your ideas. If you have any suggestions, questions, report of errors/bugs, etc. regarding the articles or website, please contact through this email: <ins>wonseunghyun248@gmail.com</ins></p>
                    <p>Source code can be found in <a href="">this repository.</a></p>
                </section>
            </main>
        </Layout>
    )
}

export default About

export const Head = () => <title>About</title>