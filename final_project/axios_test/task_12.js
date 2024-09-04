
// Call local Node.JS server using axios

const axios = require('axios').default;
const callURL = async(url)=>{
    const outcome = await axios.get(url);
    console.log(outcome.data)
}

callURL('http://localhost:5001/prom/author/hans c').catch( err => console.log(err.toString()));
