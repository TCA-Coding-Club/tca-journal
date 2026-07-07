import * as React from "react"
import { graphql, Link, navigate } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import RecentArticles from "../components/RecentArticles"

export const query = graphql`
  query HomeArticles {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        excerpt(pruneLength: 180)
        frontmatter {
          date
          title
          topic
          writer
          slug
          thumbnail {
            childImageSharp {
              gatsbyImageData(width: 1000, quality: 80, placeholder: BLURRED, formats: [AUTO, WEBP])
            }
          }
        }
      }
    }
  }
`

const POPULAR = ["Psychology", "Physics", "History", "Economics"]

const IndexPage = ({ data }) => {
  const articles = data.allMarkdownRemark.nodes
  const [q, setQ] = React.useState("")

  const doSearch = () => {
    const term = q.trim()
    navigate("/journal" + (term ? "?q=" + encodeURIComponent(term) : ""))
  }

  // Discipline facets: count per topic + newest thumbnail available in that topic
  const facets = React.useMemo(() => {
    const map = new Map()
    for (const a of articles) {
      const t = a.frontmatter.topic
      if (!map.has(t)) map.set(t, { name: t, n: 0, cover: null })
      const f = map.get(t)
      f.n += 1
      if (!f.cover && a.frontmatter.thumbnail) f.cover = a.frontmatter.thumbnail
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [articles])

  return (
    <Layout>
      <main>
        <section className="hero-band">
          <div className="inner">
            <div className="hero-kicker">The Collegiate Academy Journal</div>
            <h1>Search student research across the arts, sciences, and society.</h1>
            <div className="search-box">
              <div className="field">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a716a" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></svg>
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") doSearch() }}
                  placeholder="Search articles, authors, or disciplines"
                  aria-label="Search articles"
                />
              </div>
              <button onClick={doSearch}>Search</button>
            </div>
            <div className="popular-row">
              <span className="lbl">Popular:</span>
              {POPULAR.map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span className="dot">·</span>}
                  <Link to={"/journal?topic=" + encodeURIComponent(t)}>{t}</Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div className="wrap">
            <div className="stat"><span className="num">{articles.length}</span><span className="lbl">Articles</span></div>
            <div className="stat"><span className="num">{facets.length}</span><span className="lbl">Disciplines</span></div>
            <div className="stat"><span className="num">2023</span><span className="lbl">Since</span></div>
            <div className="stat"><span className="num">Open</span><span className="lbl">Access</span></div>
          </div>
        </section>

        <div className="wrap home-main">
          <RecentArticles articles={articles} />

          <div className="section-rule">Browse by discipline</div>
          <div className="facet-grid">
            {facets.map(f => (
              <Link key={f.name} to={"/journal?topic=" + encodeURIComponent(f.name)} className="facet-tile">
                {f.cover
                  ? <GatsbyImage image={getImage(f.cover)} alt={f.name} />
                  : <div className="grad-bg" />}
                <div className="shade" />
                <span className="count">{f.n}</span>
                <span className="name">{f.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>The Collegiate Academy Journal</title>
