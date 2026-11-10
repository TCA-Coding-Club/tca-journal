import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Layout from "../components/Layout"
import logo from "../images/tcalogo.png"
import { motionOK, createStage, countUp } from "../utils/motion"

const PUBLISH = [
  { t: "Research essays", d: "Original arguments grounded in reading and evidence, across every discipline TCA students study." },
  { t: "Monthly issues", d: "A new set of articles each month, gathered into numbered volumes and permanently archived." },
  { t: "Open access", d: "Everything is free to read, share, and cite — no paywall, no account required." },
  { t: "Built by students", d: "The site itself is designed and maintained by the TCA Coding Club, open source on GitHub." },
]

const About = () => {
  const data = useStaticQuery(graphql`
    query AboutStats {
      allMarkdownRemark {
        totalCount
        distinct(field: {frontmatter: {topic: SELECT}})
      }
    }
  `)
  const disciplineCount = data.allMarkdownRemark.distinct.length
  const articleCount = data.allMarkdownRemark.totalCount

  const [p, setP] = React.useState(0) // count-up progress, 0 → 1
  const heroRef = React.useRef(null)
  const stageRef = React.useRef(null)

  React.useEffect(() => {
    const on = motionOK()
    const offStage = createStage(heroRef.current, stageRef.current, { base: [4, -16], range: [10, 18], still: !on })
    const offCount = countUp(1600, setP, on)
    return () => { offStage(); offCount() }
  }, [])

  const disciplines = Math.round(disciplineCount * p)

  return (
    <Layout>
      <section className="hero about-hero" ref={heroRef}>
        <div className="hero-glow" />
        <div className="wrap">
          <div>
            <div className="eyebrow" data-reveal="up">About the Journal</div>
            <h1 data-reveal="clip" data-reveal-delay="80">A home for student scholarship at The Collegiate Academy</h1>
            <p className="lead" data-reveal="up" data-reveal-delay="180">
              Since 2023, TCA students have published monthly essays and research across the
              arts, natural sciences, technology, and social issues — all open access, all
              freely available to read and cite.
            </p>
          </div>

          <div data-reveal="rise" data-reveal-delay="150">
            <div className="crest-scene">
              <div className="crest-shadow" />
              <div className="crest-stage" ref={stageRef}>
                <div className="crest-ring a" />
                <div className="crest-ring b" />
                <div className="crest-img">
                  <img src={logo} alt="The Collegiate Academy crest" />
                </div>
                <div className="crest-label l1">
                  <div className="chip" data-float="8">
                    <div className="big">2023</div>
                    <div className="small">Journal founded</div>
                  </div>
                </div>
                <div className="crest-label l2">
                  <div className="chip green" data-float="10">
                    <div className="big">Open Access</div>
                    <div className="small">Free to read &amp; cite</div>
                  </div>
                </div>
                <div className="crest-label l3">
                  <div className="chip" data-float="6">
                    <div className="big">{disciplines}</div>
                    <div className="small">Disciplines</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="wrap about-main">
        <div className="about-layout">
          <div className="about-col">
            <div className="about-prose" data-reveal="up">
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

            <div className="sec-head" data-reveal="up"><h2>What we publish</h2></div>
            <div className="pub-grid">
              {PUBLISH.map((c, i) => (
                <div key={c.t} data-reveal="up" data-reveal-delay={(i % 2) * 100}>
                  <div className="pub-card" data-tilt="6">
                    <div className="no">{"0" + (i + 1)}</div>
                    <div className="t">{c.t}</div>
                    <p>{c.d}</p>
                    <div className="glare" data-glare="" />
                  </div>
                </div>
              ))}
            </div>

            <div className="sec-head" data-reveal="up"><h2>Get in touch</h2></div>
            <div className="about-prose" data-reveal="up">
              <p>
                Please don't hesitate to reach out with suggestions, corrections, or bug reports.
                You can email the editors at <a href="mailto:ddidolyi@gmail.com">ddidolyi@gmail.com</a>,
                and you can browse the site's source code on <a href="https://github.com/TCA-Coding-Club/tca-journal" target="_blank" rel="noreferrer">GitHub</a>.
              </p>
            </div>
          </div>

          <aside className="about-side">
            <section className="glance" data-reveal="up" data-reveal-delay="150">
              <h3>At a glance</h3>
              <div className="rows">
                <div><div className="num">{Math.round(articleCount * p)}</div><div className="lbl">Articles published</div></div>
                <div><div className="num">{disciplines}</div><div className="lbl">Disciplines</div></div>
                <div><div className="num">Monthly</div><div className="lbl">Publication</div></div>
                <div><div className="num">2023</div><div className="lbl">Journal founded</div></div>
              </div>
            </section>
            <section className="cta-card" data-reveal="up" data-reveal-delay="250">
              <div className="t">Start reading</div>
              <p>Explore every article published in the TCA Journal, sortable by discipline.</p>
              <Link to="/journal" className="btn">Browse the archive →</Link>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  )
}

export default About

export const Head = () => <title>About — The Collegiate Academy Journal</title>
