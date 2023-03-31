import { graphql } from "gatsby";
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
    return (
        <Layout>
            <main>
                <details open>
                    <summary><h2 className="mb-4">{title}</h2></summary>
                    <h4>{writer}</h4>
                    <small>{convertDate(date) + " — " + topic}</small>
                </details>
                <section>
                    <div dangerouslySetInnerHTML={{__html: html}} />
                </section>
            </main>
        </Layout>
    );
}
 
export default ArticlePage;