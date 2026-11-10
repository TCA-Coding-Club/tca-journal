import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import longDate from "../functions/longDate"
import logo from "../images/tcalogo.png"

// "Related reading" cards for the article page.
// `articles`: up to three {frontmatter} nodes chosen by the article template.
// Thumbnails come from one shared static query (same image size as the
// archive, so no extra images are generated at build time).
const RelatedReading = ({ articles }) => {
  const data = useStaticQuery(graphql`
    query RelatedThumbnails {
      allMarkdownRemark {
        nodes {
          frontmatter {
            slug
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 320, quality: 80, placeholder: NONE, formats: [AUTO, WEBP])
              }
            }
          }
        }
      }
    }
  `)

  const thumbs = React.useMemo(() => {
    const map = {}
    data.allMarkdownRemark.nodes.forEach(n => { map[n.frontmatter.slug] = n.frontmatter.thumbnail })
    return map
  }, [data])

  if (!articles || articles.length === 0) return null

  return (
    <section className="related no-print">
      <div className="sec-head" data-reveal="up">
        <h2>Related reading</h2>
        <Link to="/journal" className="more">Browse archive →</Link>
      </div>
      <div className="card-grid">
        {articles.map((r, i) => {
          const thumb = thumbs[r.frontmatter.slug]
          return (
            <div key={r.frontmatter.slug} data-reveal="up" data-reveal-delay={i * 100}>
              <Link to={"/journal/article-" + r.frontmatter.slug} className="art-card" data-tilt="6">
                <div className="media">
                  {thumb
                    ? <GatsbyImage className="img-fill" image={getImage(thumb)} alt={r.frontmatter.title} />
                    : <div className="ph"><img src={logo} alt="" /></div>}
                </div>
                <span className="kicker">{r.frontmatter.topic}</span>
                <h3>{r.frontmatter.title}</h3>
                <p className="meta">{r.frontmatter.writer} · {longDate(r.frontmatter.date)}</p>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default RelatedReading
