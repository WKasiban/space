import matter from 'gray-matter'
import Header from '../components/Header'
import utilStyles from "../styles/utils.module.css"
import { remark } from 'remark'
import html from 'remark-html'
import fs from 'fs'
import Link from 'next/link'


export async function getStaticProps() {
  const fileName = fs.readFileSync('posts/home.md', 'utf-8')
  const matterResult = matter(fileName)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    props: {
      contentHtml
    }
  }
}


export default function Home({ contentHtml }) {
  return (
    <div className={utilStyles.home}>
      <Header />
      <div className={utilStyles.container}>
        <section className={utilStyles.left}>
          <article className={utilStyles.contents}>
            <div className={utilStyles.contentLeft} dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        </section>
        <section className={utilStyles.right}>
            <div className={utilStyles.rightBtn}>
              <Link href="/destination">
                <a className={utilStyles.btnText}>Explore</a> 
              </Link>
            </div>
        </section>
      </div>
    </div>
  )
}
