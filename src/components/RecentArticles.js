import * as React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import convertDate from "../functions/convertDate"

const RecentArticles = () => {
    const data = useStaticQuery(graphql`
        query RecentFiles {
            allMarkdownRemark(limit: 7, sort: {frontmatter: {date: DESC}}) {
            nodes {
                id
                frontmatter {
                date
                title
                topic
                writer
                slug
                thumbnail {
                    childImageSharp {
                        gatsbyImageData(width: 900, placeholder: BLURRED, formats: [AUTO, WEBP])
                    }
                }
                }
            }
            }
        }
    `)

    const articles = data.allMarkdownRemark.nodes
    const featured = articles[0]
    const rest = articles.slice(1)

    return (
        <div>
            {featured && (
                <article className="featured">
                    <Link to={"/journal/article-" + featured.frontmatter.slug}>
                        <div className="featured-media">
                            <GatsbyImage image={getImage(featured.frontmatter.thumbnail)} alt={featured.frontmatter.title} />
                        </div>
                        <div className="featured-body">
                            <span className="topic-tag">{featured.frontmatter.topic}</span>
                            <h2>{featured.frontmatter.title}</h2>
                            <p className="byline">{featured.frontmatter.writer} · {convertDate(featured.frontmatter.date)}</p>
                        </div>
                    </Link>
                </article>
            )}

            <h2 className="eyebrow">Latest Articles</h2>
            <div className="article-grid">
                {rest.map(article => (
                    <article key={article.id}>
                        <Link to={"/journal/article-" + article.frontmatter.slug}>
                            <div className="card-media">
                                <GatsbyImage image={getImage(article.frontmatter.thumbnail)} alt={article.frontmatter.title} />
                            </div>
                            <div className="card-body">
                                <span className="topic-tag">{article.frontmatter.topic}</span>
                                <h3>{article.frontmatter.title}</h3>
                                <p className="byline">{convertDate(article.frontmatter.date)} · {article.frontmatter.writer}</p>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default RecentArticles
