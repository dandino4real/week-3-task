const { getTrips, getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  let [output, cashTrips, nonCashTrips, cashAmount, nonCashAmount, highestVehicle] = [{}, 0, 0, 0, 0, 0]
  
  
  let trips = await getTrips();
  
// trips


  trips.forEach(item=>{item.isCash? cashTrips++ : nonCashTrips++})
  trips.forEach(item=>{ item.isCash? cashAmount += parseFloat(item.billedAmount.toString().replace(/,/g, '')) :
                                    nonCashAmount += parseFloat(item.billedAmount.toString().replace(/,/g, ''))   
  })

// get driver id
let driverId = [...new Set(trips.map(elem => elem.driverID ))]

// driverId

// get highEarningDriverInfo on each driver
let driverDetails = {}
await Promise.allSettled(driverId.map(id => getDriver(id).then(highEarningDriverInfo =>  driverDetails[id] = highEarningDriverInfo)))
// driverDetails

let  driverDetailsArr = Object.values(driverDetails)
// driverDetailsArr

//  drivers with more than one vehicle
driverDetailsArr.forEach(item=> {
  if((item.vehicleID).length > 1){
    highestVehicle++
  }
})


// highest trips
// array of driverid
let driverIdAarr = []
for(let id of trips){
  driverIdAarr.push(id.driverID)
}

// driverIdAarr

// Assign the frequency/number 0f times the driverid occurs
let idFrequency = driverIdAarr.reduce((obj, value)=> { obj[value] = obj[value]? obj[value] +1 : 1;
  return obj
}, {})

// idFrequency

// the driverid with the most number of trips
let idWithMostTrips = Object.keys(idFrequency).sort().reduce((a, b)=> a[idFrequency] > b[idFrequency] ? a : b, 0 )
// idWithMostTrips

let highEarningDriverInfo = {}

for(let id of driverId){
  if(id === idWithMostTrips){
    highEarningDriverInfo.name = driverDetails[id].name
    highEarningDriverInfo.email= driverDetails[id].email
    highEarningDriverInfo.phone = driverDetails[id].phone

  }
}
let totalEarnedAmount = 0;
trips.forEach(obj=>{
  if(obj.driverID === idWithMostTrips){
      totalEarnedAmount += +obj.billedAmount.toString().replace(/,/g, '')
  }
})
highEarningDriverInfo.noOfTrips = idFrequency[idWithMostTrips]
highEarningDriverInfo.totalAmountEarned = totalEarnedAmount


// highEarningDriverInfo

// highEarningDriverInfo on highest earning driver

let driverWithEarnings = {}

driverId.forEach(id =>{
  driverWithEarnings[id] = driverWithEarnings[id]? driverWithEarnings[id] + 1 : 0
})
// driverWithEarnings

for(let id of driverId){
  for(let tr of trips){
    if(id === tr.driverID){
     driverWithEarnings[id] +=  +tr.billedAmount.toString().replace(/,/g, '')
    }
  }
}
// driverWithEarnings

let highestEarnerId = Object.keys(driverWithEarnings).reduce((a, b) => driverWithEarnings[a] > driverWithEarnings[b] ? a : b, 0)
// highestEarnerId

let highEarningDriverInfos = {}

for(let id of driverId){
  if(id === highestEarnerId){
    highEarningDriverInfos.name = driverDetails[id].name
    highEarningDriverInfos.email= driverDetails[id].email
    highEarningDriverInfos.phone = driverDetails[id].phone

  }
}

// highEarningDriverInfo

highEarningDriverInfos.noOfTrips = idFrequency[highestEarnerId]
highEarningDriverInfos.totalAmountEarned = driverWithEarnings[highestEarnerId]

// highEarningDriverInfos


output.noOfCashTrips = cashTrips;
output.noOfNonCashTrips = nonCashTrips  
output.billedTotal =  cashAmount + nonCashAmount
output.cashBilledTotal = parseFloat(cashAmount.toFixed(2))
output.nonCashBilledTotal = parseFloat(nonCashAmount.toFixed(2))
output.noOfDriversWithMoreThanOneVehicle = highestVehicle
output.mostTripsByDriver = highEarningDriverInfo
output.highestEarningDriver = highEarningDriverInfos


output
return output
  
  
}

analysis()

module.exports = analysis;
