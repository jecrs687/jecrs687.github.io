
import React from 'react'
import './articles.css'
export function ListArticles({data}){
    return(
        <div className='articles'>
            {
            data.devToArticles?
            data.devToArticles.map(
                (value,index)=>(
                    <div key={index} className="article-box">
                        <a href={value.url} >
                        <img src={value.social_image} alt='article'  />
                        <p className='title'>{value.title}</p>
                        <p className='description'>
                            {value.description}
                        </p>
                        <div className='footer'>
  
                        <div className='tags'>
                        {value.tags?
                        (value.tags.split(', ')).map(
                            (value,index)=>(
                            <p key={index} className='hashtag'>#{value}</p>
                            ))
                        :null   }
                        </div>
                        <p className='published'>
                        {value.published_at.slice(0,10)}
                        </p>
                        </div>
                        </a>

                    </div>
                )
            ):<h1>whithout articles</h1>}
            
        </div>
    )
}