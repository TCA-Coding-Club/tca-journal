import { graphql, Link } from "gatsby"
import * as React from "react"
import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import RelatedReading from "../components/RelatedReading"
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
  return `Vol. ${Number(p[0]) - 2022}, No. ${Number(p[1])}`
}

// A paragraph that opens with an image (as gatsby-remark-images or plain markdown renders it)
const LEAD_IMAGE = /^\s*<p>\s*(?:<a[^>]*>\s*)?(?:<span[^>]*class="gatsby-resp-image-wrapper"|<img)/
const TEXT_PARAGRAPH = /<p>(?!\s*(?:<a[^>]*>\s*)?(?:<span[^>]*class="gatsby-resp-image-wrapper"|<img|<audio|<video|<iframe))/

// Presentation-only tweaks to the rendered markdown:
//  - if the body opens with the same picture already shown as the hero, hide that copy
//  - mark the first text paragraph so it gets the drop cap
const prepareBody = (html, heroSrc) => {
  let out = html
  if (heroSrc && LEAD_IMAGE.test(out)) {
    const name = decodeURIComponent(heroSrc.split("/").pop() || "").replace(/\.[a-z0-9]+$/i, "")
    const firstPara = out.slice(0, out.indexOf("</p>"))
    if (name && firstPara.includes(name)) out = out.replace("<p>", '<p class="lead-dup">')
  }
  return out.replace(TEXT_PARAGRAPH, '<p class="lead">')
}

const ArticlePage = ({ data }) => {
  const { html } = data.markdownRemark
  const { date, title, topic, writer, slug, thumbnail } = data.markdownRemark.frontmatter
  const image = thumbnail ? getImage(thumbnail) : null

  const [copied, setCopied] = React.useState("")
  const articleRef = React.useRef(null)

  React.useEffect(() => {
    incrementView(slug)
  }, [slug])

  const bodyHtml = React.useMemo(
    () => prepareBody(html, thumbnail ? getSrc(thumbnail) : null),
    [html, thumbnail]
  )

  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
  const readTime = Math.max(1, Math.round(words / 200))

  const year = (date + "").split("-")[0]
  const citation = `${writer}. (${year}). ${title}. The Collegiate Academy Journal, ${volumeLabel(date)}.`

  // Same discipline first, then the most recent other articles (the list is date-desc)
  const related = React.useMemo(() => {
    const others = data.allMarkdownRemark.nodes.filter(a => a.frontmatter.slug !== slug)
    return others
      .filter(a => a.frontmatter.topic === topic)
      .concat(others.filter(a => a.frontmatter.topic !== topic))
      .slice(0, 3)
  }, [data, slug, topic])

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(""), 1800)
    } catch (e) { /* clipboard unavailable */ }
  }

  return (
    <Layout progressTarget={articleRef}>
      <main className="wrap article-main">
        <nav className="crumbs no-print" data-reveal="up">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/journal">Journal</Link><span>/</span>
          <Link to={"/journal?topic=" + encodeURIComponent(topic)} className="here">{topic}</Link>
        </nav>

        <header className="article-head">
          <div className="over" data-reveal="up">{topic} &nbsp;·&nbsp; {volumeLabel(date)}</div>
          <h1 data-reveal="clip" data-reveal-delay="80">{title}</h1>
          <div className="who" data-reveal="up" data-reveal-delay="200">
            <span className="avatar">{initials(writer)}</span>
            <div>
              <div className="name">{writer}</div>
              <div className="when">{longDate(date)} &nbsp;·&nbsp; {readTime} min read</div>
            </div>
          </div>
        </header>

        {image && (
          <figure className="article-figure" data-reveal="scale" data-reveal-delay="150">
            <div className="parallax-layer" data-parallax="0.1">
              <GatsbyImage className="img-fill" image={image} alt={title} />
            </div>
          </figure>
        )}

        <div className="article-cols">
          <aside className="meta-rail no-print" data-reveal="up" data-reveal-delay="250">
            <div className="inner">
              <div className="meta-item"><div className="k">Discipline</div><div className="v">{topic}</div></div>
              <div className="meta-item"><div className="k">Author</div><div className="v">{writer}</div></div>
              <div className="meta-item"><div className="k">Published</div><div className="v">{longDate(date)}</div></div>
              <div className="meta-item"><div className="k">Issue</div><div className="v">{volumeLabel(date)}</div></div>

              <button className="dl-btn" onClick={() => { if (typeof window !== "undefined") window.print() }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m8 11 4 4 4-4" /><path d="M4 19h16" /></svg>
                Download PDF
              </button>
              <div className="meta-actions">
                <button onClick={() => copy(citation, "cite")}>{copied === "cite" ? "Copied ✓" : "Cite"}</button>
                <button onClick={() => copy(typeof window !== "undefined" ? window.location.href : "", "share")}>{copied === "share" ? "Link copied ✓" : "Share"}</button>
              </div>
              <Link to="/journal" className="back-to-archive">← Back to archive</Link>
            </div>
          </aside>

          <article className="article-col" ref={articleRef}>
            <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

            <div className="cite-box" data-reveal="up">
              <div className="h">How to cite this article</div>
              <p>{citation}</p>
            </div>
          </article>
        </div>

        <RelatedReading articles={related} />
      </main>
    </Layout>
  )
}

export default ArticlePage

export const Head = ({ data }) => <title>{data.markdownRemark.frontmatter.title} — The Collegiate Academy Journal</title>
