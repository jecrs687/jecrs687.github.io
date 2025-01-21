import "./Projects.css"



interface ProjectProps {
    colors: { primary: string; secundary: string; third: string; }[];
    name: string;
    link: string;
}

function Project({ colors, name, link }: ProjectProps){
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

export interface ProjectsData {
    projects: { name: string; link: string; }[][];
    paletter: { primary: string; secundary: string; third: string; }[];
}

export function Projects({data}: { data: any }){
    return(
        <div className='projects'>
            <div className="box-project">
        <div className="grid-projects">
              {Object.keys(data.projects).map(
              key => (data.projects[+key].map((project: { name: string; link: string; }) => (<Project colors={data.paletter} name={project.name} link={project.link} />))
              ))}
               </div>
                    </div>
        </div>
    )
}