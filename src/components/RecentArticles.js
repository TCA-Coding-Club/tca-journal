import * as React from "react"
import { graphql, Link, useStaticQuery} from "gatsby"
import convertDate from "../functions/convertDate"

const RecentArticles = () => {
    const data = useStaticQuery(graphql`
        query ThreeRecentFiles {
            allMarkdownRemark(limit: 3, sort: {frontmatter: {date: DESC}}) {
            nodes {
                id
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
    `)
    
    const articles = data.allMarkdownRemark.nodes

    return (
        <div>
            <h2 className="mb-4">Recent Articles</h2>
            <div className="grid">
                {articles.map(article => (
                    <article className="mt-4">
                        <Link to={"/journal/article-" + article.frontmatter.slug} key={article.id}>
                            <div>
                                <h3 className="mb-4">{article.frontmatter.title}</h3>
                                <p className="mb-4">{article.frontmatter.topic}</p>
                                <p className="mb-4">{convertDate(article.frontmatter.date) + " " + article.frontmatter.writer}</p>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    )
}
 
export default RecentArticles