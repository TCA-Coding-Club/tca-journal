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
                    <p><mark><a href="https://www.thecollegiateacademy.net/" target="_blank">The Collegiate Academy (TCA)</a></mark> is an international school located in Goyang, South Korea. Developed by TCA's coding club, this website is where students upload their articles monthly. We are still updating and adding new features to the website, so we are open to hearing your ideas. If you have any suggestions or want to report any bugs, feel free to contact this email: <ins>wonseunghyun248@gmail.com</ins></p>
                    <p>You can access the entire source code <a href="https://github.com/ws-h842/tca-journal" target="_blank">here</a>.</p>
                </section>
            </main>
        </Layout>
    )
}

export default About

export const Head = () => <title>About</title>