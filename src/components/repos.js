import React from 'react';
import './repos.css';

export default function repos({repo}){
    return (
    
    
    <div className='box-repo'>
        <p className='path'>{repo.full_name}</p>
        <a href={repo.html_url}>
            <h3>{repo.name}</h3>
        </a>
        <p className='desc'>{repo.description}</p>
        <p className='created_at'>created at: {repo.created_at.slice(0,10)} {Date(repo.created_at).slice(16,24)} </p>
        <p className='updated_at'>updated at: {repo.updated_at.slice(0,10)} {Date(repo.updated_at).slice(16,24)} </p>
        <div className='fork'>
        {repo.fork?<p className='fork'>fork</p>:null}
        </div>
            {console.log(Date(repo.created_at))}
    </div>
        
        
        )
}