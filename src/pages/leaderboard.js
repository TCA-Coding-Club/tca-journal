import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import { getAllViews } from "../functions/views"

export const query = graphql`
  query Leaderboard {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        frontmatter {
          title
          writer
          topic
          slug
          thumbnail {
            childImageSharp {
              gatsbyImageData(width: 200, placeholder: BLURRED, formats: [AUTO, WEBP])
            }
          }
        }
      }
    }
  }
`

const PER_PAGE = 10

const Leaderboard = ({ data }) => {
  const articles = data.allMarkdownRemark.nodes

  const [views, setViews] = React.useState({})
  const [topic, setTopic] = React.useState("")
  const [page, setPage] = React.useState(0)

  React.useEffect(() => {
    setViews(getAllViews())
  }, [])

  const topics = React.useMemo(
    () => [...new Set(articles.map(a => a.frontmatter.topic))].sort(),
    [articles]
  )

  const ranked = React.useMemo(() => {
    const list = topic
      ? articles.filter(a => a.frontmatter.topic === topic)
      : articles
    // stable sort keeps date-desc order for equal view counts
    return [...list].sort(
      (a, b) => (views[b.frontmatter.slug] || 0) - (views[a.frontmatter.slug] || 0)
    )
  }, [articles, views, topic])

  const pages = Math.max(1, Math.ceil(ranked.length / PER_PAGE))
  const safePage = Math.min(page, pages - 1)
  const start = safePage * PER_PAGE
  const rows = ranked.slice(start, start + PER_PAGE)

  const onTopic = e => { setTopic(e.target.value); setPage(0) }

  return (
    <Layout>
      <main className="wrap page-main">
        <div className="page-title-block">
          <div className="eyebrow">Reader statistics</div>
          <h1>Most Viewed Articles</h1>
        </div>

        <div className="lb-filters">
          <label htmlFor="lb-topic">Topic</label>
          <select id="lb-topic" value={topic} onChange={onTopic}>
            <option value="">All topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="lb-list">
          {rows.map((a, i) => {
            const rank = start + i + 1
            const count = views[a.frontmatter.slug] || 0
            return (
              <Link
                key={a.id}
                to={"/journal/article-" + a.frontmatter.slug}
                className={"lb-row" + (rank <= 3 ? " top" : "")}
              >
                <span className="lb-rank">{rank}</span>
                <span className="lb-main">
                  <h3>{a.frontmatter.title}</h3>
                  <span className="sub">{a.frontmatter.writer} · {a.frontmatter.topic}</span>
                </span>
                <span className="lb-views"><b>{count}</b> views</span>
                <span className="lb-thumb">
                  {a.frontmatter.thumbnail && <GatsbyImage image={getImage(a.frontmatter.thumbnail)} alt="" />}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="lb-pager">
          <button onClick={() => setPage(0)} disabled={safePage === 0} aria-label="First page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6l-6 6 6 6M12 6l-6 6 6 6" /></svg>
          </button>
          <button onClick={() => setPage(safePage - 1)} disabled={safePage === 0} aria-label="Previous page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <span className="page-ind">{safePage + 1} / {pages}</span>
          <button onClick={() => setPage(safePage + 1)} disabled={safePage >= pages - 1} aria-label="Next page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <button onClick={() => setPage(pages - 1)} disabled={safePage >= pages - 1} aria-label="Last page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l6 6-6 6M12 6l6 6-6 6" /></svg>
          </button>
        </div>
      </main>
    </Layout>
  )
}

export default Leaderboard

export const Head = () => <title>Leaderboard — TCA Journal</title>
