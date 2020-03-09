import React from 'react'
import "./Projects.css"



function Project({colors,name,link}){
    var palette = Math.floor(Math.random() * colors.length);
    var color= colors[palette].primary;
    var color2= colors[palette].secundary;
    var color3= colors[palette].third;
return(
    <div className='project' onClick={()=>{window.open(`https://jecrs687.github.io${link}`)}} style={{background: `linear-gradient(${color}, ${color2}, ${color3})`}}>
        <span className='title'>{name}</span>
    </div>
)
}

export function Projects({data}){
    return(
        <div className='projects'>
              {Object.keys(data.projects).map(
              value=>(
                  <div className="box-project">
                      <span className="title-project">{value}</span>
                        <div className="grid-projects">
                          {data.projects[value].map((value)=>(<Project colors={data.paletter} name={value.name} link={value.link} />))}
                        </div>
                    </div>
              ))}          
        </div>
    )
}