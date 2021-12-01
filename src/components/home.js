import React from 'react'
import "./home.css"
// import { TiDocument,TiSocialFacebookCircular,TiSocialInstagramCircular,TiSocialGithubCircular,TiSocialLinkedinCircular } from "react-icons/ti";
// import logo from '../assets/jecrs687.jpg';

export function Home({data}){
    return(
        <div className="home">
            <div className="base">
            <h1 className="name">Emanuel Cascone</h1>
            <span className="subline">________________________</span>
            <div className="boxSetas">
            <div className="setas">👇👇👇👇👇</div>
            </div>
            </div>
            <div className="Parallax">
            <div className="ParallaxItem">
                <div className="first">
                    Nice to meet you
                </div>
                <div className="second">
                    How you know, I'm Emanuel
                </div>
            </div>
            <div className="ParallaxItem">
                    <div className="second">

                </div>
                <div className="third">
                    
                </div>
            </div>
            <div className="ParallaxItem">
                    <div className="third">

                </div>
                </div>
                <div className="end">
                    
                </div>
            </div>
            <div className="ParallaxEnd"></div>
        </div>
/* <header className="App-header">
      <div className="App-background" src=''></div>        
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
                {data.loves.map((value,index)=><li key={index} style={{fontFamily:'sans-serif', fontWeight:100}}>{value}</li>)}
                </ul>
          </div>

          <div className='box-icon'>
            <a href={data.facebook}><TiSocialFacebookCircular className='icon'/></a>
            <a href={data.github}><TiSocialGithubCircular className='icon'/></a>
            <a href={data.instagram}><TiSocialInstagramCircular className='icon'/></a>
            <a href={data.linkerdin}><TiSocialLinkedinCircular className='icon'/></a>
          </div> 

        </div>

      </header> */
    )
      }