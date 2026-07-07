import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import longDate from "../functions/longDate"
import logo from "../images/tcalogo.png"

export const query = graphql`
  query ArchiveArticles {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        excerpt(pruneLength: 200)
        frontmatter {
          date
          title
          topic
          writer
          slug
          thumbnail {
            childImageSharp {
              gatsbyImageData(width: 320, quality: 80, placeholder: BLURRED, formats: [AUTO, WEBP])
            }
          }
        }
      }
    }
  }
`

// Issues are numbered from the journal's founding: Vol = year - 2022, No = month
const volumeLabel = date => {
  const p = (date + "").split("-")
  return `Vol. ${Number(p[0]) - 2022} · No. ${Number(p[1])}`
}

const Journal = ({ data }) => {
  const articles = data.allMarkdownRemark.nodes

  const [q, setQ] = React.useState("")
  const [topic, setTopic] = React.useState("")
  const [sort, setSort] = React.useState("newest")

  // Deep links: /journal?topic=Physics and /journal?q=capybara
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("topic")) setTopic(p.get("topic"))
    if (p.get("q")) setQ(p.get("q"))
  }, [])

  const facets = React.useMemo(() => {
    const counts = {}
    articles.forEach(a => { counts[a.frontmatter.topic] = (counts[a.frontmatter.topic] || 0) + 1 })
    return Object.keys(counts).sort().map(name => ({ name, n: counts[name] }))
  }, [articles])

  const results = React.useMemo(() => {
    let list = articles
    if (topic) list = list.filter(a => a.frontmatter.topic === topic)
    const term = q.trim().toLowerCase()
    if (term) {
      list = list.filter(a =>
        (a.frontmatter.title + " " + a.frontmatter.writer + " " + a.frontmatter.topic + " " + a.excerpt)
          .toLowerCase()
          .includes(term)
      )
    }
    list = [...list]
    if (sort === "newest") list.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
    else if (sort === "oldest") list.sort((a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date))
    else if (sort === "title") list.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
    return list
  }, [articles, q, topic, sort])

  const reset = () => { setQ(""); setTopic(""); setSort("newest") }

  const scope =
    (topic ? ` in ${topic}` : "") +
    (q.trim() ? ` matching “${q.trim()}”` : "")

  return (
    <Layout search={{ value: q, onChange: e => setQ(e.target.value) }}>
      <main className="wrap page-main">
        <div className="archive-title">
          <div className="eyebrow">Browse the collection</div>
          <h1>Article Archive</h1>
        </div>

        <div className="archive-layout">
          <aside className="facet-rail">
            <section className="facet-panel">
              <h3>Search within results</h3>
              <div className="rail-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a716a" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></svg>
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Keyword or author"
                  aria-label="Search within results"
                />
              </div>
            </section>

            <section className="facet-panel">
              <div className="head">
                <h3>Discipline</h3>
                {topic && <button className="clear-btn" onClick={() => setTopic("")}>Clear</button>}
              </div>
              <div className="facet-list">
                <button
                  className={"facet-row" + (!topic ? " active" : "")}
                  onClick={() => setTopic("")}
                >
                  <span>All disciplines</span><span className="n">{articles.length}</span>
                </button>
                {facets.map(f => (
                  <button
                    key={f.name}
                    className={"facet-row" + (topic === f.name ? " active" : "")}
                    onClick={() => setTopic(f.name)}
                  >
                    <span>{f.name}</span><span className="n">{f.n}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <div style={{ minWidth: 0 }}>
            <div className="results-bar">
              <p><strong>{results.length}</strong> {results.length === 1 ? "article" : "articles"}{scope}</p>
              <div className="sort-ctl">
                <span className="lbl">Sort by</span>
                <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort results">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>
            </div>

            {results.length > 0 ? (
              <div>
                {results.map(a => (
                  <article key={a.id} className="result-row">
                    <div className="thumb">
                      {a.frontmatter.thumbnail
                        ? <GatsbyImage image={getImage(a.frontmatter.thumbnail)} alt={a.frontmatter.title} />
                        : (
                          <div className="ph-tile">
                            <span className="crest" style={{ width: 52, height: 52 }}>
                              <img src={logo} alt="" style={{ width: 44, height: 44 }} />
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="content">
                      <div className="tags">
                        <span className="topic-chip">{a.frontmatter.topic}</span>
                        <span className="vol">{volumeLabel(a.frontmatter.date)}</span>
                        <span className="oa-chip">Open Access</span>
                      </div>
                      <h3><Link to={"/journal/article-" + a.frontmatter.slug}>{a.frontmatter.title}</Link></h3>
                      <p className="byline">{a.frontmatter.writer} &nbsp;·&nbsp; {longDate(a.frontmatter.date)}</p>
                      <p className="excerpt">{a.excerpt}</p>
                      <div className="links">
                        <Link to={"/journal/article-" + a.frontmatter.slug}>Read article →</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="big">No articles found</p>
                <p className="sub">Try a different keyword or clear your filters.</p>
                <button className="btn-accent" onClick={reset}>Reset filters</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Journal

export const Head = () => <title>Article Archive — The Collegiate Academy Journal</title>
