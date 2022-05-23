import Header from "../components/Header";
import techStyles from "../styles/technology.module.css"
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Image from "next/image";

const postsDirectory = path.join(process.cwd(), 'posts/technology')

export async function getStaticProps() {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPosts = await Promise.all(fileNames.map(async fileName => {
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const matterResult = matter(fileContents)
        const processedContents = await remark()
            .use(html)
            .process(matterResult.content)
        const contentHtml = processedContents.toString()
        return {
            path: fullPath,
            content: contentHtml,
            ...matterResult.data
        }
    }))
   


    return {
        props: {
            allPosts: JSON.parse(JSON.stringify(allPosts))
        }
    }
    
}

export default function Technology({ allPosts }) {
    return (
        <>
            <div className={techStyles.technology}>
                <Header />
                <div className={techStyles.container}>
                    <h2 className={techStyles.header}>01<span>Space launch 101</span></h2>
                    
                    {allPosts.map((post) => (
                        <> 
                           <div className={techStyles.tabsContainer}>  
                            <div className={techStyles.tab}>
                            <input 
                                type="radio"
                                id={post.title}
                                name="technology"
                                value={post.title}
                                className={techStyles.radioTab}
                                defaultChecked
                            /> 
                            <label htmlFor={post.title} 
                                className={techStyles.label} 
                                key={post.order}
                                style={post.order === 1 ? {marginTop: '2rem'} : post.order === 2 ? {marginTop: '7rem'} : {marginTop: '12rem'}}
                            >
                                {post.order}
                            </label>
                            
                            <div className={techStyles.contentContainer}>
                                    <div dangerouslySetInnerHTML={{ __html: post.content}} className={techStyles.content} />
                                    <Image 
                                        src={post.imageLandscape}
                                        alt={post.title}
                                        width={200}
                                        height={200}
                                        className={techStyles.image}
                                        layout='responsive'
                                    />
                                </div>
                            </div>
                            </div>
                        </>

                    ))}
                
                </div>
            </div>
        </>
    )
}