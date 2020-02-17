import axios from 'axios'
const user = require('../information.json')
const github = axios.create({baseURL:`https://api.github.com/users/${user.githubUser}`})
const medium = axios.create({baseURL:`https://medium.com/@${user.mediumUser}/latest?format=json`})
export async function getGithub(){
   var userInfo =  (await github.get('')).data
   var repos =  (await github.get('/repos')).data
   return {...userInfo,repos:repos}
    }
export async function getMedium(){
   var MediumArtics = (await medium.get('/posts'))
   return {mArtics:MediumArtics}
   }
  