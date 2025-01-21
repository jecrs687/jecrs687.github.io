import React from 'react'
import "./home.css"
 import { TiSocialFacebookCircular,TiSocialInstagramCircular,TiSocialGithubCircular,TiSocialLinkedinCircular } from "react-icons/ti";
import logo from '../assets/jecrs687.jpg';

interface Info {
  avatar_url: string;
  nick: string;
  name: string;
  work: string;
}

interface Data {
  loves: (string | number | boolean | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | null | undefined)[];
  facebook: string;
  github: string;
  instagram: string;
  linkerdin: string;
}

export function Home({info, data}: {info: Info, data: Data}){
    return(
      
<header className="App-header">
      <div className="App-background" ></div>        
        <div className='box'>
          <div className='box-info'>
            <div className='box-img'>
              <div>
              </div>
              <div>
              </div>
              <img src={info.avatar_url!==''? info.avatar_url:logo} className="App-logo" alt="logo" />
          </div>
          </div>
          <div className='bio'>
            <h1>{info.nick}</h1>
            <h5 style={{fontWeight:300}}>{info.name}, <br/>{info.work}</h5>
                I LOVE:
                <ul>
                {data.loves.map((value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined,index: React.Key | null | undefined)=><li key={index} style={{fontFamily:'sans-serif', fontWeight:100}}>{value}</li>)}
                </ul>
          </div>

          <div className='box-icon'>
            <a href={data.facebook}><TiSocialFacebookCircular className='icon'/></a>
            <a href={data.github}><TiSocialGithubCircular className='icon'/></a>
            <a href={data.instagram}><TiSocialInstagramCircular className='icon'/></a>
            <a href={data.linkerdin}><TiSocialLinkedinCircular className='icon'/></a>
          </div> 

        </div>

      </header> 
    )
      }