import * as React from "react"
import { graphql, Link, navigate } from "gatsby"
import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import RecentArticles from "../components/RecentArticles"
import longDate from "../functions/longDate"
import { motionOK, createStage, countUp } from "../utils/motion"

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

const SearchIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7370" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
)

const IndexPage = ({ data }) => {
  const articles = data.allMarkdownRemark.nodes
  const [q, setQ] = React.useState("")
  const [p, setP] = React.useState(0) // count-up progress, 0 → 1

  const heroRef = React.useRef(null)
  const stageRef = React.useRef(null)

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

  // Hero stack: the three most recent illustrated articles after the featured one
  const stack = React.useMemo(
    () => articles.slice(1).filter(a => a.frontmatter.thumbnail).slice(0, 3),
    [articles]
  )

  React.useEffect(() => {
    const on = motionOK()
    const offStage = createStage(heroRef.current, stageRef.current, { still: !on })
    const offCount = countUp(1600, setP, on)
    return () => { offStage(); offCount() }
  }, [])

  const stackCard = (a, cls, delay, float, withByline) => a && (
    <Link
      to={"/journal/article-" + a.frontmatter.slug}
      className={"stack-card " + cls}
      data-reveal="assemble"
      data-reveal-delay={delay}
    >
      <div className="face" data-float={float}>
        <div className="pic"><img src={getSrc(a.frontmatter.thumbnail)} alt="" /></div>
        <div className="txt">
          <span className="topic">{a.frontmatter.topic}</span>
          <span className="title">{a.frontmatter.title}</span>
          {withByline && <span className="by">{a.frontmatter.writer} · {longDate(a.frontmatter.date)}</span>}
        </div>
      </div>
    </Link>
  )

  return (
    <Layout>
      <section className="hero home-hero" ref={heroRef}>
        <div className="hero-glow" />
        <div className="wrap">
          <div className="cols">
            <div>
              <div className="eyebrow" data-reveal="up">Open-access student scholarship</div>
              <h1 data-reveal="clip" data-reveal-delay="80">Search student research across the arts, sciences, and society.</h1>
              <p className="intro" data-reveal="up" data-reveal-delay="180">
                Monthly essays and research by students of The Collegiate Academy, free to read, cite, and share.
              </p>
              <div className="search-box" data-reveal="up" data-reveal-delay="260">
                <div className="field">
                  <SearchIcon />
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
              <div className="popular-row" data-reveal="up" data-reveal-delay="340">
                <span className="lbl">Popular:</span>
                {POPULAR.map(t => (
                  <Link key={t} to={"/journal?topic=" + encodeURIComponent(t)}>{t}</Link>
                ))}
              </div>
            </div>

            <div data-reveal="rise" data-reveal-delay="150">
              <div className="stack-scene">
                <div className="stack-shadow" />
                <div className="stack-stage" ref={stageRef}>
                  {stackCard(stack[2], "s3", 520, 7, false)}
                  {stackCard(stack[1], "s2", 380, 9, false)}
                  {stackCard(stack[0], "s1", 240, 11, true)}
                </div>
              </div>
            </div>
          </div>

          <div className="stats-row" data-reveal="up" data-reveal-delay="200">
            <div><div className="num">{Math.round(articles.length * p)}</div><div className="lbl">Articles</div></div>
            <div><div className="num">{Math.round(facets.length * p)}</div><div className="lbl">Disciplines</div></div>
            <div><div className="num">2023</div><div className="lbl">Since</div></div>
            <div><div className="num">Open</div><div className="lbl">Access</div></div>
          </div>
        </div>
      </section>

      <main className="wrap home-main">
        <RecentArticles articles={articles} />

        <div className="sec-head" data-reveal="up">
          <h2>Browse by discipline</h2>
          <span className="note">{facets.length} disciplines</span>
        </div>
        <div className="facet-grid">
          {facets.map((f, i) => (
            <div key={f.name} data-reveal="up" data-reveal-delay={(i % 4) * 80}>
              <Link to={"/journal?topic=" + encodeURIComponent(f.name)} className="facet-tile" data-tilt="10">
                {f.cover
                  ? <GatsbyImage className="img-fill" image={getImage(f.cover)} alt={f.name} />
                  : <div className="grad-bg" />}
                <div className="shade" />
                <span className="count">{f.n}</span>
                <span className="name">{f.name}</span>
                <div className="glare" data-glare="" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>The Collegiate Academy Journal</title>
