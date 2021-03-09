import React from 'react';
import './repos.css';
import {GoRepo} from "react-icons/go";

export function Repo({repo}){
    const cores={
        "c":"brown",
        "java":"red",
        "python":"#99ccff",
        "c++":"pink",
        "vhdl":"violet",
        "javascript":"yellow",
        "html":"red"

    }
    function lastUpdate(date){
        var now = new Date().getTime()
        var repoDate = new Date(date).getTime()
        var diference = now - repoDate;
        diference = diference/(1000*60*60);
        if(diference<1){
            return "few minutes"
        }else if(diference<24){
            return `Update at ${diference.toFixed(0)} hours ago`
        }
        else{
            return `Update at ${date.slice(8,10)}-${date.slice(5,7)}-${date.slice(0,4)}`
        }
        
    }
    return (
    <div className='box-repo'>
        <p className='path'>/{repo.full_name}</p>
        
        <a href={repo.html_url} className="name">
            <GoRepo className="icon"/>
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
        <p className='created_at'>{repo.created_at.slice(8,10)}-{repo.created_at.slice(5,7)}-{repo.created_at.slice(0,4)} </p>
        <p className='updated_at'>{lastUpdate(repo.updated_at)} </p>
        </div>
        {repo.homepage !== '' && repo.homepage !== null?
        <a 
        href={repo.homepage} 
        className='homepage'
        >official Page</a>:null}
    </div>
        
        
        )
}
export function Repos({info}){
    const repos = info.repos
    return(      
    <div className='repos'>
    {repos.map((value,index)=>(
    <Repo repo={value} key={index}/>
    ))}      
    </div>
    )
}