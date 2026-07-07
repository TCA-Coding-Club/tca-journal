import * as React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import longDate from "../functions/longDate"
import logo from "../images/tcalogo.png"

const initials = name =>
  (name || "").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()

const Fallback = ({ topic, size = 46, logoSize = 38 }) => (
  <div className="ph-tile">
    <span className="crest" style={{ width: size + 14, height: size + 14 }}>
      <img src={logo} alt="" style={{ width: logoSize, height: logoSize }} />
    </span>
    <span className="ph-name">{topic}</span>
  </div>
)

// `articles`: date-desc sorted nodes from the home page query.
// Renders the "Featured this issue" block (newest) + "Latest research" grid.
const RecentArticles = ({ articles }) => {
  const featured = articles[0]
  const cards = articles.slice(1, 7)

  return (
    <>
      <div className="section-rule">Featured this issue</div>
      {featured && (
        <Link to={"/journal/article-" + featured.frontmatter.slug} className="featured">
          <div className="featured-media">
            {featured.frontmatter.thumbnail
              ? <GatsbyImage image={getImage(featured.frontmatter.thumbnail)} alt={featured.frontmatter.title} />
              : <Fallback topic={featured.frontmatter.topic} size={60} logoSize={50} />}
          </div>
          <div className="featured-body">
            <span className="topic-chip">{featured.frontmatter.topic}</span>
            <h2>{featured.frontmatter.title}</h2>
            <p className="excerpt">{featured.excerpt}</p>
            <div className="featured-byline">
              <span className="avatar">{initials(featured.frontmatter.writer)}</span>
              <div>
                <div className="name">{featured.frontmatter.writer}</div>
                <div className="date">{longDate(featured.frontmatter.date)}</div>
              </div>
            </div>
            <span className="read-more">Read full article →</span>
          </div>
        </Link>
      )}

      <div className="section-rule">Latest research</div>
      <div className="card-grid">
        {cards.map(a => (
          <Link key={a.id} to={"/journal/article-" + a.frontmatter.slug} className="art-card">
            <div className="media">
              {a.frontmatter.thumbnail
                ? <GatsbyImage image={getImage(a.frontmatter.thumbnail)} alt={a.frontmatter.title} />
                : <Fallback topic={a.frontmatter.topic} />}
            </div>
            <div className="body">
              <span className="eyebrow">{a.frontmatter.topic}</span>
              <h3>{a.frontmatter.title}</h3>
              <p className="meta">{a.frontmatter.writer} &nbsp;·&nbsp; {longDate(a.frontmatter.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default RecentArticles
