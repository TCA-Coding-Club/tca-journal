import * as React from "react"
import { graphql, Link, useStaticQuery} from 'gatsby'
import DateConvert from "../DateConvert"

const RecentArticles = () => {
    const data = useStaticQuery(graphql`
        query RecentArticles {
            allMarkdownRemark(filter: {frontmatter: {month: {eq: 202304}}}, limit: 6) {
            nodes {
                frontmatter {
                month
                title
                topic
                slug
                writer
                }
                id
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
                                <p className="mb-4">{DateConvert(article.frontmatter.month) + " " + article.frontmatter.writer}</p>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
        
    )
}
 
export default RecentArticles