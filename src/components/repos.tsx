import React from 'react';
import './repos.css';
import { GoRepo } from "react-icons/go";

interface RepoProps {
    repo: {
        full_name: string;
        html_url: string;
        name: string;
        description: string;
        language: string | null;
        fork: boolean;
        created_at: string;
        updated_at: string;
        homepage: string | null;
    };
}

export function Repo({ repo }: RepoProps): React.ReactElement {
    const cores: { [key: string]: string } = {
        "c": "brown",
        "java": "red",
        "python": "#99ccff",
        "c++": "pink",
        "vhdl": "violet",
        "javascript": "yellow",
        "html": "red"

    }

    return (<div className='box-repo'>
        <p className='path'>/{repo.full_name}</p>

        <a href={repo.html_url} className="name">
            <GoRepo className="icon" />
            <h3>{repo.name}</h3>
        </a>
        <p className='desc'>{repo.description}</p>

        <div className='fork-box'>
            {repo.language !== null ?
                <div className='fork-subbox'>
                    <div className='ball' style={{
                        backgroundColor: cores[repo.language.toLowerCase()] || 'grey'
                    }}></div>
                    <p>{repo.language}</p>
                </div> :
                <div className='fork-subbox' />
            }
            {repo.fork ? <p className='fork'>fork</p> : <div className='fork' />}
        </div>
        <div className='time'>
            <p className='created_at'>{repo.created_at.slice(8, 10)}-{repo.created_at.slice(5, 7)}-{repo.created_at.slice(0, 4)} </p>
            <p className='updated_at'>{lastUpdate(repo.updated_at)} </p>
        </div>
        {repo.homepage !== '' && repo.homepage !== null ?
            <a
                href={repo.homepage}
                className='homepage'
            >official Page</a> : null}
    </div>


    )
}

function lastUpdate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

interface ReposProps {
    info: {
        repos: RepoProps['repo'][];
    };
}

export function Repos({ info }: ReposProps) {
    const repos = info.repos
    return (
        <div className='repos'>
            {repos.map((value, index) => (
                <Repo repo={value} key={index} />
            ))}
        </div>
    )
}