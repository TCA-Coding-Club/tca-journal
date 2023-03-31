import * as React from "react"
import Layout from "../components/Layout"
import { Link } from "gatsby"
import convertDate from "../functions/convertDate"
import { graphql } from "gatsby"

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
        }
      }
    }
  }
`

const Journal = ({data}) => {

  const articles = data.allMarkdownRemark.nodes
  
  const [searchedTitle, setSearchedTitle] = React.useState('')
  const [selectedTopic, setSelectedTopic] = React.useState('')

  const [a, setA] = React.useState(articles)
  
  const handleReset = () => {
    window.location.reload(false);
  }

  const handleApply = () => {
    setA(articles)
    if (searchedTitle !== "") {
      setA(a.filter((article) => {
        return article.frontmatter.title.toLowerCase().includes(searchedTitle.toLowerCase)
      }))
      console.log(a)
    }
    if (selectedTopic !== "") {
      setA(a.filter((article) => {
        return selectedTopic === article.frontmatter.topic
      }))
    }
  }

  return (
    <Layout>
      <main>
        <section>
          <h2>Journals</h2>
          <details open>
            <summary><strong>Sort</strong></summary>
            <input type="search" id="search" name="search" placeholder="Search title" onChange={event => setSearchedTitle(event.target.value)}/>
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
              <option value="Theatre">Theatre</option>
            </select>
            <div>
              <a href="#" role="button" className="mr-8" onClick={handleApply}>Apply</a>
              <a href="#" role="button" onClick={handleReset}>Reset</a>
            </div>
            <div>

            </div>
          </details>
          <div className="grid grid-3-col">
                {a.map(article => (
                    <article className="mt-4">
                        <Link to={"/journal/article-" + article.frontmatter.slug} key={article.id}>
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

export const Head = () => <title>Journal | TCA Journal</title>