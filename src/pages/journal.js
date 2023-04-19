import * as React from "react"
import Layout from "../components/Layout"
import { Link } from "gatsby"
import convertDate from "../functions/convertDate"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export const query = graphql`
  query AllFiles {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        frontmatter {
          date
          title
          topic
          writer
          slug
          thumbnail {
            childImageSharp {
              gatsbyImageData(
                width: 1000, 
                placeholder: BLURRED, 
                formats: [AUTO, WEBP]
              )
            }
          }
        }
      }
    }
  }
`

const Journal = ({data}) => {
  const articles = data.allMarkdownRemark.nodes
  
  const [selectedTopic, setSelectedTopic] = React.useState('')

  const [a, setA] = React.useState(articles)

  const handleApply = () => {
    if (selectedTopic !== "") {
      setA(a.filter((article) => {
        return selectedTopic === article.frontmatter.topic
      }))
    }
  }

  const handleReset = () => {
    window.location.reload(false);
  }

  return (
    <Layout>
      <main>
        <section>
          <h2>Journals</h2>
          <details open>
            <summary><strong>Sort</strong></summary>
            <label for="topic">Topic</label>
            <select id="topic" onChange={event => setSelectedTopic(event.target.value)}>
              <option value="" selected>Select a topic…</option>
              <option value="Animals">Animals</option>
              <option value="Art">Art</option>
              <option value="Biology">Biology</option>
              <option value="Music">Music</option>
              <option value="Painting">Painting</option>
              <option value="Physics">Physics</option>
              <option value="Social Issues">Social Issues</option>
              <option value="Software">Software</option>
              <option value="Technology">Technology</option>
              <option value="Theater">Theater</option>
            </select>
            <div className="mb-4">
              <a href="#" role="button" onClick={handleApply} className="mr-8">Apply</a>
              <a href="#" role="button" onClick={handleReset}>Reset</a>
            </div>
            <small className="mt-4">Please press "Reset" when sorting for new articles</small>
          </details>
          <div>
                {a.map(article => (
                    <article className="mt-4">
                        <Link to={"/journal/article-" + article.frontmatter.slug} key={article.id}>
                          <GatsbyImage className="flex-column mb-8" image={getImage(article.frontmatter.thumbnail)} alt="Thumbnail"/>
                          <div>
                            <h3 className="mb-4">{article.frontmatter.title}</h3>
                            <p className="mb-4">{article.frontmatter.topic}</p>
                            <p className="mb-4">{convertDate(article.frontmatter.date) + " " + article.frontmatter.writer}</p>
                          </div>
                        </Link>
                    </article>
                ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Journal

export const Head = () => <title>Journal</title>