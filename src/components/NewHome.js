import React from 'react'
import "./home.css"
import logo from '../assets/022Fl.gif'
import {Cube} from './subComponents/cube'

export function Home({ info, data }) {
  return (
    <div className="home">
      <div className="parallax">
        <div className="base" id="base">

          <div className="name">
            Emanuel Cascone
          </div>
          <span className="subline">______________________________________________</span>

          <div className="boxSetas">
            <div className="setas">👇👇👇👇👇</div>
          </div>
          <div className="img">
          <img alt="todoro" src={logo}/>
          </div>
        </div>

        <div className="parallax_group" id="one">
          <div className="parallax_item first">
            Hi, I'm emanuel
          </div>
          <div className="parallax_item second">
            Nice to meet you
          </div>
        </div>
        <div className="parallax_group" id="second">
          <div className="parallax_item second">
          I'm a computer science student
          </div>
          <div className="parallax_item third">
              And passionate with new technologies
          </div>
        </div>
        <div className="end">
          <Cube/>
        </div>
      </div>
    </div>



  )
}