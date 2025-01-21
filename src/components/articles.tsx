
import './articles.css'
interface Article {
    url: string;
    social_image: string;
    title: string;
    description: string;
    tags: string;
    published_at: string;
}

export interface ArticlesData {
    devToArticles?: Article[];
}

export function ListArticles({data}: {data: ArticlesData}){
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
  
                        <ul className='tags'>
                        {value.tags?
                        (value.tags.split(', ')).map(
                            (value,index)=>(
                            <li key={index} className='hashtag'>#{value}</li>
                            ))
                        :null   }
                        </ul>
                        <div className='published'>
                        <p>
                        {value.published_at.slice(0,10)}
                        </p>
                        </div>
                        </div>
                        </a>

                    </div>
                )
            ):<h1>whithout articles</h1>}
            
        </div>
    )
}