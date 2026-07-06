import { graphql, Link } from "gatsby";
import * as React from "react"
import Layout from "../components/Layout"
import convertDate from "../functions/convertDate"

export const query = graphql`
    query ArticlePage($slug: String) {
        markdownRemark(frontmatter: {slug: {eq: $slug}}) {
        html
        frontmatter {
            date
            title
            topic
            writer
        }
        }
    }
`

const ArticlePage = ({data}) => {
    const { html } = data.markdownRemark
    const { date, title, topic, writer } = data.markdownRemark.frontmatter

    // Estimate reading time from the rendered text (~200 words/minute)
    const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
    const readTime = Math.max(1, Math.round(words / 200))

    const handleDownload = () => {
        if (typeof window !== "undefined") window.print()
    }

    return (
        <Layout>
            <main className="article-page">
                <header className="article-hero">
                    <span className="topic-tag">{topic}</span>
                    <h1>{title}</h1>
                    <p className="article-authors">{writer}</p>
                    <p className="article-meta-line">{convertDate(date)} · {readTime} min read</p>
                </header>

                <div className="article-columns">
                    <aside className="article-sidebar">
                        <div className="meta-block">
                            <div className="meta-row">
                                <h4>Section</h4>
                                <p>{topic}</p>
                            </div>
                            <div className="meta-row">
                                <h4>Author</h4>
                                <p>{writer}</p>
                            </div>
                            <div className="meta-row">
                                <h4>Published</h4>
                                <p>{convertDate(date)}</p>
                            </div>
                            <div className="meta-row">
                                <h4>Reading time</h4>
                                <p>{readTime} min</p>
                            </div>
                            <button className="download-btn" onClick={handleDownload}>
                                ⤓ Print / Save as PDF
                            </button>
                        </div>
                        <Link className="back-link" to="/journal">← Back to archive</Link>
                    </aside>

                    <div className="article-body" dangerouslySetInnerHTML={{__html: html}} />
                </div>
            </main>
        </Layout>
    );
}

export default ArticlePage;
