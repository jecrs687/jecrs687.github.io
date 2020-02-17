


export default function datas(){
    return (    
    <div>
    <div className='App-data'>
    <h1>Basic Information</h1>
    <ul style={{textAlign:'justify'}}>
      <li>Country: {data.country}</li>
      <li>Age:{data.age}</li>
      <li>Email: {data.email}</li>
      <li>Phone:{data.phone}</li>
      <li>City: {data.city}</li>
      <li>Address: {data.address}</li>
      </ul>
    <p>
    </p>
  </div>
<div style={{paddingRight:'75px', paddingLeft:'75px'}} className='App-data'>
<h4>Bio</h4>
<div>
<p>
"{data.bio}"
   </p>
   </div>
   </div>
   </div>
   )
}
