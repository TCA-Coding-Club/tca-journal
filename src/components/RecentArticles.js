import * as React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import longDate from "../functions/longDate"
import logo from "../images/tcalogo.png"

const initials = name =>
  (name || "").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()

// Soft green tile with the bare crest, for articles without a thumbnail.
const Fallback = () => (
  <div className="ph"><img src={logo} alt="" /></div>
)

// `articles`: date-desc sorted nodes from the home page query.
// Renders the "Featured this issue" block (newest) + "Latest research" grid.
const RecentArticles = ({ articles }) => {
  const featured = articles[0]
  const cards = articles.slice(1, 7)

  return (
    <>
      <div className="sec-head" data-reveal="up">
        <h2>Featured this issue</h2>
        <span className="tag">Editor's pick</span>
      </div>
      {featured && (
        <Link to={"/journal/article-" + featured.frontmatter.slug} className="featured">
          <div className="featured-media" data-reveal="scale">
            {featured.frontmatter.thumbnail ? (
              <div className="parallax-layer" data-parallax="0.07">
                <GatsbyImage
                  className="img-fill"
                  image={getImage(featured.frontmatter.thumbnail)}
                  alt={featured.frontmatter.title}
                />
              </div>
            ) : <Fallback />}
          </div>
          <div data-reveal="up" data-reveal-delay="120">
            <span className="kicker">{featured.frontmatter.topic}</span>
            <h3>{featured.frontmatter.title}</h3>
            <p className="excerpt">{featured.excerpt}</p>
            <div className="featured-byline">
              <span className="avatar">{initials(featured.frontmatter.writer)}</span>
              <div className="who">
                <div className="name">{featured.frontmatter.writer}</div>
                <div className="date">{longDate(featured.frontmatter.date)}</div>
              </div>
              <span className="read-more">Read article →</span>
            </div>
          </div>
        </Link>
      )}

      <div className="sec-head" data-reveal="up">
        <h2>Latest research</h2>
        <Link to="/journal" className="more">View all articles →</Link>
      </div>
      <div className="card-grid">
        {cards.map((a, i) => (
          <div key={a.id} data-reveal="up" data-reveal-delay={(i % 3) * 100}>
            <Link to={"/journal/article-" + a.frontmatter.slug} className="art-card" data-tilt="6">
              <div className="media">
                {a.frontmatter.thumbnail
                  ? <GatsbyImage className="img-fill" image={getImage(a.frontmatter.thumbnail)} alt={a.frontmatter.title} />
                  : <Fallback />}
              </div>
              <span className="kicker">{a.frontmatter.topic}</span>
              <h3>{a.frontmatter.title}</h3>
              <p className="meta">{a.frontmatter.writer} &nbsp;·&nbsp; {longDate(a.frontmatter.date)}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default RecentArticles
