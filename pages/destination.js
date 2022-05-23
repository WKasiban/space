import Header from "../components/Header";
import destinationStyles from "../styles/destination.module.css"
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Image from "next/image";

const postsDirectory = path.join(process.cwd(), 'posts/destination')

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

export default function Destination({ allPosts }) {
    
    return (
        <>
            <div className={destinationStyles.destination}>
                <Header />
                <div className={destinationStyles.container}>
                    <h2 className={destinationStyles.header}>01<span>Pick your destination</span></h2>
                    
                    {allPosts.map((post) => (
                        <> 
                           <div className={destinationStyles.tabsContainer}>  
                                <div className={destinationStyles.tab}>
                                    <input 
                                        type="radio"
                                        id={post.title}
                                        name="destination"
                                        value={post.title}
                                        className={destinationStyles.radioTab}
                                        defaultChecked
                                    /> 
                                    <label htmlFor={post.title} className={destinationStyles.label} key={post.title}>{post.title}</label>
                            
                                    <div className={destinationStyles.contentContainer}>
                                        <Image 
                                            src={post.image}
                                            alt={post.title}
                                            width={300}
                                            height={300}
                                        />
                                        <div dangerouslySetInnerHTML={{ __html: post.content}} className={destinationStyles.content} />
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