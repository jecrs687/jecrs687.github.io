import axios from 'axios'
const user = require('../information.json')
const github = axios.create({baseURL:`https://api.github.com/users/${user.githubUser}`})
const  devTo = axios.create({baseURL:`https://dev.to/api/articles?username=${user.devToUser}`})
export async function getGithub(){
   var userInfo =  (await github.get('')).data
   var repos    =  (await github.get('/repos')).data
   console.log(repos)
   return {...userInfo,repos:repos}
    }
export async function getDevTo(){
   var devToArtics = (await devTo.get('')).data
   // var devToArtics={};
   return {devToArticles:devToArtics}
   }
  