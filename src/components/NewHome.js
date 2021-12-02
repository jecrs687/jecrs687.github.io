import React from 'react'
import "./home.css"


export function Home({ info, data }) {
  return (
    <div className="home">
      <div className="base">

        <div className="name">
          Emanuel Cascone
        </div>
        <span className="subline">______________________________________________</span>

        <div className="boxSetas">
          <div className="setas">👇👇👇👇👇</div>
        </div>
      </div>
      <div className="parallax">
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
            Nice to meet you
          </div>
          <div className="parallax_item third">
            You can scrolling to see everything I done
          </div>
        </div>
      </div>
    </div>



  )
}