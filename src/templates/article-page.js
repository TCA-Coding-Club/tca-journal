import { graphql, Link } from "gatsby"
import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import longDate from "../functions/longDate"
import { incrementView } from "../functions/views"

export const query = graphql`
  query ArticlePage($slug: String) {
    markdownRemark(frontmatter: {slug: {eq: $slug}}) {
      html
      frontmatter {
        date
        title
        topic
        writer
        slug
        thumbnail {
          childImageSharp {
            gatsbyImageData(width: 1400, quality: 82, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
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

const initials = name =>
  (name || "").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()

const volumeLabel = date => {
  const p = (date + "").split("-")
  return `Vol. ${Number(p[0]) - 2022} · No. ${Number(p[1])}`
}

const ArticlePage = ({ data }) => {
  const { html } = data.markdownRemark
  const { date, title, topic, writer, slug, thumbnail } = data.markdownRemark.frontmatter
  const image = thumbnail ? getImage(thumbnail) : null

  const [copied, setCopied] = React.useState("")

  React.useEffect(() => {
    incrementView(slug)
  }, [slug])

  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
  const readTime = Math.max(1, Math.round(words / 200))

  const year = (date + "").split("-")[0]
  const citation = `${writer}. (${year}). ${title}. The Collegiate Academy Journal, ${volumeLabel(date)}.`

  const related = data.allMarkdownRemark.nodes
    .filter(a => a.frontmatter.topic === topic && a.frontmatter.slug !== slug)
    .slice(0, 3)

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(""), 2000)
    } catch (e) { /* clipboard unavailable */ }
  }

  return (
    <Layout>
      <main className="wrap page-main">
        <nav className="crumbs no-print">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/journal">Journal</Link><span>/</span>
          <Link to={"/journal?topic=" + encodeURIComponent(topic)} className="here">{topic}</Link>
        </nav>

        <header className="article-hero">
          <span className="topic-chip">{topic}</span>
          <h1>{title}</h1>
          <div className="who">
            <span className="avatar">{initials(writer)}</span>
            <div>
              <div className="name">{writer}</div>
              <div className="when">{longDate(date)} &nbsp;·&nbsp; {readTime} min read</div>
            </div>
          </div>
        </header>

        {image && (
          <figure className="article-figure">
            <div className="frame">
              <GatsbyImage image={image} alt={title} />
            </div>
          </figure>
        )}

        <div className="article-cols">
          <aside className="meta-rail no-print">
            <div className="inner">
              <div className="meta-item"><div className="k">Discipline</div><div className="v">{topic}</div></div>
              <div className="meta-item"><div className="k">Author</div><div className="v">{writer}</div></div>
              <div className="meta-item"><div className="k">Published</div><div className="v">{longDate(date)}</div></div>
              <div className="meta-item" style={{ marginBottom: 18 }}><div className="k">Issue</div><div className="v">{volumeLabel(date)}</div></div>

              <button className="dl-btn" onClick={() => { if (typeof window !== "undefined") window.print() }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m8 11 4 4 4-4" /><path d="M4 19h16" /></svg>
                Download PDF
              </button>
              <div className="meta-actions">
                <button onClick={() => copy(citation, "cite")}>{copied === "cite" ? "Copied!" : "Cite"}</button>
                <button onClick={() => copy(typeof window !== "undefined" ? window.location.href : "", "share")}>{copied === "share" ? "Copied!" : "Share"}</button>
              </div>
              <Link to="/journal" className="back-to-archive">← Back to archive</Link>
            </div>
          </aside>

          <article style={{ minWidth: 0 }}>
            <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="cite-box">
              <div className="h">How to cite this article</div>
              <p>{citation}</p>
            </div>

            {related.length > 0 && (
              <div className="related no-print">
                <div className="section-rule">More in {topic}</div>
                {related.map(r => (
                  <Link key={r.frontmatter.slug} to={"/journal/article-" + r.frontmatter.slug} className="related-item">
                    <h3>{r.frontmatter.title}</h3>
                    <p>{r.frontmatter.writer} · {longDate(r.frontmatter.date)}</p>
                  </Link>
                ))}
              </div>
            )}
          </article>
        </div>
      </main>
    </Layout>
  )
}

export default ArticlePage

export const Head = ({ data }) => <title>{data.markdownRemark.frontmatter.title} — The Collegiate Academy Journal</title>
