import react from "react";
import Header from "../components/Header";
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Image from "next/image";
import crewStyles from "../styles/crew.module.css"

const postsDirectory = path.join(process.cwd(), 'posts/crew')

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

export default function Crew({ allPosts }) {
    const [radioSelected, setRadioSelected] = react.useState(false)

    react.useEffect(() => {
        const crewMembers = document.getElementsByName('crew')
        const timer = setTimeout(() => {
           for (let i=0; i<crewMembers.length; i++) {
             setRadioSelected(!radioSelected) 
             if (crewMembers[i].checked) {
                 if (i === crewMembers.length-1) {
                     crewMembers[0].checked = true
                 } else {
                     crewMembers[i+1].checked = true
                 }
                 break
             }
           }
        }, 3000)
        return () => clearTimeout(timer)
    }, [radioSelected])
  
    return (
        <>
            <div className={crewStyles.crew}>
                <Header />
                <div className={crewStyles.container}>
                    <h2 className={crewStyles.header}>02<span>Meet your crew</span></h2>
                    
                    {allPosts.map((post) => (
                        <> 
                            <div className={crewStyles.tabsContainer}>  
                                <div className={crewStyles.tab}>
                                    <input 
                                        type="radio"
                                        id={post.title}
                                        name="crew"
                                        value={post.title}
                                        className={crewStyles.radioTab}
                                        defaultChecked 
                                    /> 
                                    <label htmlFor={post.title} 
                                        className={crewStyles.label} 
                                        key={post.order}>
                                            &#x25CF;
                                    </label>
                                    <div className={crewStyles.contentContainer}>
                                        <div dangerouslySetInnerHTML={{ __html: post.content}} className={crewStyles.content} />
                                        <Image 
                                            src={post.image}
                                            alt={post.title}
                                            width={300}
                                            height={300}
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