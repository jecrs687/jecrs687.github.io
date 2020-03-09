import React from 'react'
import "./Projects.css"



function Project({colors,name}){
    
    var palette = Math.floor(Math.random() * colors.length);

    var color= colors[palette].primary;
    var color2= colors[palette].secundary;
    var color3= colors[palette].third;
return(
    <div className='project' onClick={()=>{}} style={{background: `linear-gradient(${color}, ${color2}, ${color3})`}}>
        <span className='title'>{name}</span>
    </div>
)
}

export function Projects({data}){
    return(
        <div className='projects'>
              {Object.keys(data.projects).map(
              value=>(
              <Project colors={data.paletter} name={value} data={data.projects[value]}/>
              ))}          
        </div>
    )
}