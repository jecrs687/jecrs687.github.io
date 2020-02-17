import React from 'react';
import './repos.css';

export default function repos({repo}){
    const cores={
        "c":"brown",
        "java":"red",
        "python":"#99ccff",
        "c++":"pink",
        "vhdl":"violet",
        "javascript":"yellow",
        "html":"red"

    }
    
    return (
    <div className='box-repo'>
        <p className='path'>/{repo.full_name}</p>
        <a href={repo.html_url}>
            <h3>{repo.name}</h3>
        </a>
        <p className='desc'>{repo.description}</p>

        <div className='fork-box'>
        {repo.language!==null?
            <div  className='fork-subbox'>
            <div className='ball' style={{
                backgroundColor: cores[repo.language.toLowerCase()]
                }}></div>
            <p>{repo.language}</p>
            </div>:                
            <div  className='fork-subbox'/>
        }

        {repo.fork?<p className='fork'>fork</p>:<div className='fork'/>}
        </div>
        <div className='time'>
        <p className='created_at'>{repo.created_at.slice(0,10)} {Date(repo.created_at).slice(16,24)} </p>
        <p className='updated_at'>{repo.updated_at.slice(0,10)} {Date(repo.updated_at).slice(16,24)} </p>
        </div>
    </div>
        
        
        )
}