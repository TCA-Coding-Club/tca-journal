import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import longDate from "../functions/longDate"
import logo from "../images/tcalogo.png"
import { motionOK, createOrbit } from "../utils/motion"

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
  return `Vol. ${Number(p[0]) - 2022}, No. ${Number(p[1])}`
}

// Planets per orbit ring: inner, middle, outer
const RING_SIZES = [3, 4, 5]

const Journal = ({ data }) => {
  const articles = data.allMarkdownRemark.nodes

  const [q, setQ] = React.useState("")
  const [topic, setTopic] = React.useState("")
  const [sort, setSort] = React.useState("newest")
  const [hover, setHover] = React.useState(null)

  const stageRef = React.useRef(null)
  const resultsRef = React.useRef(null)
  const matchRef = React.useRef(null) // Set of matching slugs, or null when unfiltered

  // Deep links: /journal?topic=Physics and /journal?q=capybara
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("topic")) setTopic(p.get("topic"))
    if (p.get("q")) setQ(p.get("q"))
  }, [])

  // Discipline medallions: count per topic + newest thumbnail in that topic
  const facets = React.useMemo(() => {
    const counts = {}
    const covers = {}
    articles.forEach(a => {
      const t = a.frontmatter.topic
      counts[t] = (counts[t] || 0) + 1
      if (!covers[t] && a.frontmatter.thumbnail) covers[t] = a.frontmatter.thumbnail
    })
    return Object.keys(counts).sort().map(name => ({ name, n: counts[name], cover: covers[name] }))
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

  // The orbit reads this on every frame to dim planets outside the current filter
  matchRef.current = (topic || q.trim())
    ? new Set(results.map(a => a.frontmatter.slug))
    : null

  // Orbit planets: the 12 most recent illustrated articles, split 3 / 4 / 5 across the rings
  const planets = React.useMemo(() => {
    const withImg = articles.filter(a => a.frontmatter.thumbnail)
    const out = []
    let idx = 0
    RING_SIZES.forEach((n, ring) => {
      const group = withImg.slice(idx, idx + n)
      idx += n
      group.forEach((a, j) => out.push({
        slug: a.frontmatter.slug,
        title: a.frontmatter.title,
        topic: a.frontmatter.topic,
        writer: a.frontmatter.writer,
        src: getSrc(a.frontmatter.thumbnail),
        ring,
        phase: (j / group.length + ring * 0.17).toFixed(4),
      }))
    })
    return out
  }, [articles])

  React.useEffect(() => {
    const orbit = createOrbit(stageRef.current, {
      still: !motionOK(),
      isMatch: slug => !matchRef.current || matchRef.current.has(slug),
      onHover: slug => { if (slug) setHover(slug) },
    })
    return () => orbit.destroy()
  }, [])

  // Fade the results back in whenever the filter or sort changes
  const firstRun = React.useRef(true)
  React.useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (!motionOK() || !resultsRef.current || !resultsRef.current.animate) return
    resultsRef.current.animate(
      [{ opacity: 0.2, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" }
    )
  }, [q, topic, sort])

  const reset = () => { setQ(""); setTopic(""); setSort("newest") }

  const scope =
    (topic ? ` in ${topic}` : "") +
    (q.trim() ? ` matching “${q.trim()}”` : "")

  const cap = planets.find(p => p.slug === hover) || {}

  return (
    <Layout>
      <section className="hero orbit-hero">
        <div className="hero-glow" />
        <div className="wrap">
          <div className="title">
            <div className="eyebrow both" data-reveal="up">Browse the collection</div>
            <h1 data-reveal="clip" data-reveal-delay="80">Article Archive</h1>
          </div>

          <div data-reveal="rise" data-reveal-delay="150">
            <div className="orbit-stage" ref={stageRef}>
              <div className="orbit-rings">
                <div className="orbit-ring r0" data-orbit-ring="" data-ring="0" />
                <div className="orbit-ring r1" data-orbit-ring="" data-ring="1" />
                <div className="orbit-ring r2" data-orbit-ring="" data-ring="2" />
              </div>
              <div className="orbit-pulse" data-pulse="" />
              <div className="orbit-pulse" data-pulse="" />
              <div className="orbit-pulse" data-pulse="" />
              <div className="orbit-sun" data-sun="">
                <img src={logo} alt="The Collegiate Academy crest" />
              </div>
              {planets.map(p => (
                <Link
                  key={p.slug}
                  to={"/journal/article-" + p.slug}
                  className="planet"
                  data-planet=""
                  data-ring={p.ring}
                  data-phase={p.phase}
                  data-slug={p.slug}
                  aria-label={p.title}
                >
                  <span><img src={p.src} alt="" /></span>
                </Link>
              ))}
              <div className="orbit-caption" data-orbit-caption="">
                <span className="kicker">{cap.topic}</span>
                <div className="t">{cap.title}</div>
                <div className="w">{cap.writer}</div>
              </div>
            </div>
          </div>

          <div className="orbit-search" data-reveal="up" data-reveal-delay="250">
            <div className="box">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6b7370" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></svg>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search by title, author, or keyword"
                aria-label="Search articles"
              />
            </div>
            <p className="hint">Hover an article to pause the orbit. Click it to read.</p>
          </div>
        </div>
      </section>

      <main className="wrap archive-main">
        <div className="sec-head" data-reveal="up">
          <h2>Explore by discipline</h2>
          {topic && <button className="link-btn" onClick={() => setTopic("")}>Clear filter</button>}
        </div>
        <div className="medallions" data-reveal="up" data-reveal-delay="80">
          <button className={"medallion" + (!topic ? " on" : "")} onClick={() => setTopic("")} aria-pressed={!topic}>
            <span className="disc">
              <span className="pic logo"><img src={logo} alt="" /></span>
              <span className="n">{articles.length}</span>
            </span>
            <span className="name">All</span>
          </button>
          {facets.map(f => (
            <button
              key={f.name}
              className={"medallion" + (topic === f.name ? " on" : "")}
              onClick={() => setTopic(topic === f.name ? "" : f.name)}
              aria-pressed={topic === f.name}
            >
              <span className="disc">
                <span className="pic">
                  {f.cover
                    ? <GatsbyImage className="img-fill" image={getImage(f.cover)} alt="" />
                    : <span className="grad" />}
                </span>
                <span className="n">{f.n}</span>
              </span>
              <span className="name">{f.name}</span>
            </button>
          ))}
        </div>

        <div className="results">
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

          <div ref={resultsRef}>
            {results.length > 0 ? (
              results.map((a, i) => (
                <div key={a.id} className="result" data-reveal="up" data-reveal-delay={Math.min(i, 4) * 70}>
                  <Link to={"/journal/article-" + a.frontmatter.slug} className="result-row">
                    <div className="thumb" data-tilt="10">
                      {a.frontmatter.thumbnail
                        ? <GatsbyImage className="img-fill" image={getImage(a.frontmatter.thumbnail)} alt="" />
                        : <div className="ph"><img src={logo} alt="" /></div>}
                      <div className="glare" data-glare="" />
                    </div>
                    <div className="content">
                      <div className="tags">
                        <span className="kicker">{a.frontmatter.topic}</span>
                        <span className="vol">{volumeLabel(a.frontmatter.date)}</span>
                        <span className="oa-chip">Open Access</span>
                      </div>
                      <h3>{a.frontmatter.title}</h3>
                      <p className="byline">{a.frontmatter.writer} &nbsp;·&nbsp; {longDate(a.frontmatter.date)}</p>
                      <p className="excerpt">{a.excerpt}</p>
                      <span className="read">Read article →</span>
                    </div>
                  </Link>
                </div>
              ))
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
