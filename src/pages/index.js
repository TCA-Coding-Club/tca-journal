import * as React from "react"
import Layout from "../components/Layout"
import { Link } from "gatsby"
import { siteMetadata } from "../../gatsby-config"
import RecentArticles from "../components/RecentArticles"

const TOPICS = [
  "Art", "Astronomy", "Biology", "Business", "Chemistry", "Computer Science",
  "Culture", "Economics", "Environment", "History", "Music", "Philosophy",
  "Physics", "Psychology", "Social Issues", "Sports", "Technology",
]

const IndexPage = () => {
  return (
    <Layout>
      <main>
        <div className="home-layout">
          <div className="home-main">
            <RecentArticles />
          </div>

          <aside className="home-sidebar">
            <section className="panel">
              <h3 className="panel-title">About the Journal</h3>
              <p>{siteMetadata.description}</p>
              <Link className="panel-link" to="/about">About this journal →</Link>
            </section>

            <section className="panel">
              <h3 className="panel-title">Browse by Topic</h3>
              <ul className="topic-list">
                {TOPICS.map(topic => (
                  <li key={topic}>
                    <Link to={`/journal?topic=${encodeURIComponent(topic)}`}>{topic}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h3 className="panel-title">Archive</h3>
              <p>Explore every article published in the TCA Journal, sortable by topic.</p>
              <Link className="panel-link" to="/journal">View full archive →</Link>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>TCA Journal — Home</title>
