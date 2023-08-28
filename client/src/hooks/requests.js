const API_URL = 'http://localhost:5000/v1';


async function httpGetPlanets() {
  const res = await fetch(`${API_URL}/planets`);
  // console.log(res.json(),'res');
  return await res.json();
}

async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await res.json();
  
  return fetchedLaunches.sort((a, b) => {
    // this will give us negative result
    return a.flightNumber - b.flightNumber
  })

}

async function httpSubmitLaunch(launch) {
  // fetch's default method is get if we want to use post we need to declare it
  // we use try catch to more sure and to prevent form connection lost if request didnot make it
  try {
    return await fetch(`${API_URL}/launches`, {
    method: 'post',
    headers: {
      "Content-Type" : "application/json"
    },
    // convert object into json string
    body: JSON.stringify(launch)
  })
  } catch (error) {
    console.log(error);
    return {
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  
  try {
     console.log('success');
     return await fetch(`${API_URL}/launches/${id}`, {
         method: "delete"
     });
   
  } catch (error) {
    console.log(error);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};