import React,{useEffect,useState} from 'react';
import logo from './assets/jecrs687.jpg';
import './App.css';
import { TiDocument,TiSocialFacebookCircular,TiSocialInstagramCircular,TiSocialGithubCircular,TiSocialLinkedinCircular } from "react-icons/ti";
import {GoRepo,GoHome} from "react-icons/go";
import {FaBrain} from "react-icons/fa";
import {MdSettings} from "react-icons/md";

import {getGithub,getDevTo} from './services/api'
import {Repos} from './components/repos'
import {ListSkills}from './components/skills';
import {ListArticles}from './components/articles';

const data = require('./information.json')






function App() {
  const [info,setInfo]=useState(data)
  const [guia,setGuia]=useState('home')
  const [dark,setDark]=useState(true)
  // const [,setReload] = useState(false)
  useEffect(
    ()=>{
    function insert(github){
      var temp = data
      temp.nick = github.login
      temp.name = github.name
      temp.avatar_url = github.avatar_url
      temp.repos = github.repos
      setInfo(temp)
    }
    async function load(){  
    const github =  await getGithub();
    await insert(github)
    const devTo =  await getDevTo();
    setInfo(value=>({...value, ...devTo}))
    }
    if(data.githubLogin!==''){
    load();

  }

  },[])
  return (
    <div className="App">
      <div className='navBar'>
        <ul className='navBar-nav'>
          <li  onClick={()=>{setGuia('home')}} className='navBar-item'>
            <GoHome className='icon'/>
            <span className='nav-link'>home</span>
          </li>
          <li  onClick={()=>{setGuia('repos')}} className='navBar-item'>
            <GoRepo className='icon'/>
            <span className='nav-link'>Repositories</span>
          </li>
          <li onClick={()=>{setGuia('skills')}} className='navBar-item'>
            <TiDocument className='icon'/>
            <span className='nav-link' >Skills</span>
          </li>
          <li onClick={()=>{setGuia('articles')}} className='navBar-item'>
            <FaBrain className='icon'/>
            <span className='nav-link' >articles</span>
          </li>
          <li className='navBar-item' 
          
          onClick={
          
            ()=>{
                dark?
                document.body.style.setProperty('--theme','#fff')
                :
                document.body.style.setProperty('--theme','#111')
                dark?
                document.body.style.setProperty('--primary','black')
                :
                document.body.style.setProperty('--primary','#fff')

                setDark(!dark)

            }
            
          
            }>
            <MdSettings className='icon'/>
            <span className='nav-link' >settings</span>
          </li>
        </ul>
       </div>
       <div className="body">
       { guia==='home'?
      <header className="App-header">
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

      </header>:

       <div className='App-body'>
      { guia==='repos'?
        <Repos info={info}/>:
        guia==='skills'?<ListSkills data={info}/>:
        guia==='articles'?<ListArticles data={info}/>:null}
      </div>}
      
      <div className='App-footer'><p>Powered by <a href='/#'>@jecr687</a>   2020</p>
      </div>

    </div>
    </div>
  );
}

export default App;
