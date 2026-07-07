import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Layout from "../components/Layout"

const About = () => {
  const data = useStaticQuery(graphql`
    query AboutStats {
      allMarkdownRemark {
        distinct(field: {frontmatter: {topic: SELECT}})
      }
    }
  `)
  const disciplineCount = data.allMarkdownRemark.distinct.length

  return (
    <Layout>
      <main>
        <section className="about-band">
          <div className="wrap">
            <div className="inner">
              <div className="eyebrow">About the Journal</div>
              <h1>A home for student scholarship at The Collegiate Academy</h1>
              <p className="lead">
                Since 2023, TCA students have published monthly essays and research across the
                arts, natural sciences, technology, and social issues — all open access, all
                freely available to read and cite.
              </p>
            </div>
          </div>
        </section>

        <div className="wrap about-main">
          <div className="about-layout">
            <div style={{ minWidth: 0 }}>
              <div className="about-prose">
                <p>
                  <a href="https://www.thecollegiateacademy.net/" target="_blank" rel="noreferrer">The Collegiate Academy (TCA)</a> is
                  an international school in Goyang, South Korea. This journal is where monthly
                  articles authored by TCA students are published. Developed and maintained by the
                  school's Coding Club, the site is continually adding new features and welcoming
                  new contributors.
                </p>
                <p>
                  Our aim is simple: to give students a real venue for real writing. Every article
                  is given a permanent link and citation and preserved in an archive that anyone
                  can browse. We believe scholarship is a skill best learned by doing it in public.
                </p>
              </div>

              <h2 className="about-h2">What we publish</h2>
              <div className="pub-grid">
                <div className="pub-card">
                  <div className="t">Research essays</div>
                  <p>Original arguments grounded in reading and evidence, across every discipline TCA students study.</p>
                </div>
                <div className="pub-card">
                  <div className="t">Monthly issues</div>
                  <p>A new set of articles each month, gathered into numbered volumes and permanently archived.</p>
                </div>
                <div className="pub-card">
                  <div className="t">Open access</div>
                  <p>Everything is free to read, share, and cite — no paywall, no account required.</p>
                </div>
                <div className="pub-card">
                  <div className="t">Built by students</div>
                  <p>The site itself is designed and maintained by the TCA Coding Club, open source on GitHub.</p>
                </div>
              </div>

              <h2 className="about-h2">Get in touch</h2>
              <div className="about-prose">
                <p>
                  Please don't hesitate to reach out with suggestions, corrections, or bug reports.
                  You can email the editors at <a href="mailto:ddidolyi@gmail.com">ddidolyi@gmail.com</a>,
                  and you can browse the site's source code on <a href="https://github.com/ws-h842/tca-journal" target="_blank" rel="noreferrer">GitHub</a>.
                </p>
              </div>
            </div>

            <aside className="about-side">
              <section className="glance">
                <h3>At a glance</h3>
                <div className="rows">
                  <div><div className="num">2023</div><div className="lbl">Founded</div></div>
                  <div><div className="num">{disciplineCount}</div><div className="lbl">Disciplines covered</div></div>
                  <div><div className="num">Monthly</div><div className="lbl">Publication schedule</div></div>
                  <div><div className="num">Open</div><div className="lbl">Access model</div></div>
                </div>
              </section>
              <section className="cta-card">
                <div className="t">Start reading</div>
                <p>Explore every article published in the TCA Journal, sortable by discipline.</p>
                <Link to="/journal" className="btn">Browse the archive →</Link>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default About

export const Head = () => <title>About — The Collegiate Academy Journal</title>
