const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  let newReport = await getTrips();

  let driverId = [];
  let cashTrips = {};
  let nonCashTrips = {};
  let totalEarnings = {};
  let cashAmount = {};
  let nonCashAmount = {};

  for (let item of newReport) {
    //getting unique drivers Id
    if (!driverId.includes(item["driverID"])) {
      driverId.push(item["driverID"]);
    }
    driverId;
    // checking if the cash is true to implement count
    if (item["isCash"]) {
      if (cashTrips[item.driverID]) {
        cashTrips[item.driverID]++;
      } else {
        cashTrips[item.driverID] = 1;
      }
    }
    if (!item["isCash"]) {
      if (nonCashTrips[item.driverID]) {
        nonCashTrips[item.driverID]++;
      } else {
        nonCashTrips[item.driverID] = 1;
      }
    }
    if (totalEarnings[item.driverID]) {
      totalEarnings[item.driverID] += parseFloat(
        String(item.billedAmount).split(",").join("")
      );
    } else {
      totalEarnings[item.driverID] = parseFloat(
        String(item.billedAmount).split(",").join("")
      );
    }
    if (item.isCash) {
      if (cashAmount[item.driverID]) {
        cashAmount[item.driverID] += parseFloat(
          String(item["billedAmount"]).split(",").join("")
        );
      } else {
        cashAmount[item.driverID] = parseFloat(
          String(item["billedAmount"]).split(",").join("")
        );
      }
    }
    if (!item.isCash) {
      if (nonCashAmount[item.driverID]) {
        nonCashAmount[item.driverID] += parseFloat(
          String(item["billedAmount"]).split(",").join("")
        );
      } else {
        nonCashAmount[item.driverID] = parseFloat(
          String(item["billedAmount"]).split(",").join("")
        );
      }
    }
  }

  let cashTripsInfo = Object.values(cashTrips);
  let nonCashTripsInfo = Object.values(nonCashTrips);
  let totalEarningsInfo = Object.values(totalEarnings);
  let totalCash = Object.values(cashAmount);
  let totalNonCash = Object.values(nonCashAmount);

  let driverDetails = [];
  for (let m of driverId) {
    driverDetails.push(getDriver(m));
  }
  let promiseDriverInfo = await Promise.allSettled(driverDetails);

  let correctDriverInfo = [];
  //getting drivers status that are fulfilled
  for (let item of promiseDriverInfo) {
    if (item["status"] === "fulfilled") {
      correctDriverInfo.push(item);
    }
  }

  //getting number of trips per driver
  const driverTrips = {};
  for (let item of newReport) {
    if (driverTrips[item.driverID]) {
      driverTrips[item.driverID]++;
    }
    // if key doesn't exist set key value to 1
    else {
      driverTrips[item.driverID] = 1;
    }
  }
  //to get the values of driverTrips alone
  let numOfTrips = Object.values(driverTrips);

  //getting vehicleID and information
  let vehicle = [];
  let vehicleInformation = [];
  for (let item of correctDriverInfo) {
    if (!vehicle.includes(item.value["vehicleID"])) {
      vehicle.push(item.value.vehicleID);
    }
  }
  for (let item of vehicle) {
    if (!vehicle.includes["vehicleID"]) {
      vehicleInformation.push(getVehicle(item));
    }
  }
  let promiseVehicleInfo = await Promise.allSettled(vehicleInformation);

  //sort out the fulfilled status
  let correctVehicleInfo = [];
  for (let item of promiseVehicleInfo) {
    if (item["status"] === "fulfilled") {
      correctVehicleInfo.push(item);
    }
  }
  //getting vehicles plate and manufacturer
  let vehiclesPlate;
  let vehicleDetails = [];
  for (let item in correctVehicleInfo) {
    vehiclesPlate = {};
    vehiclesPlate["plate"] = correctVehicleInfo[item].value.plate;
    vehiclesPlate["manufacturer"] = correctVehicleInfo[item].value.manufacturer;
    vehicleDetails.push(vehiclesPlate);
  }

  //  user information
  let userDetails = [];
  for (let item in newReport) {
    let userInfo = {};
    userInfo["user"] = newReport[item].user.name;
    userInfo["created"] = newReport[item].created;
    userInfo["pickup"] = newReport[item].pickup;
    userInfo["destination"] = newReport[item].destination;
    userInfo["billed"] = newReport[item].billedAmount;
    userInfo["isCash"] = newReport[item].isCash;

    userDetails.push(userInfo);
  }

  //computing driver information
  let driverArray = [];

  for (let item in correctDriverInfo) {
    let driverInfo = {};
    if (correctDriverInfo[item]) {
      driverInfo["fullName"] = correctDriverInfo[item].value.name;
      driverInfo["id"] = driverId[item];
      driverInfo["phone"] = correctDriverInfo[item].value.phone;
      driverInfo["noOfTrips"] = numOfTrips[item];
      driverInfo["noOfVehicles"] =
        correctDriverInfo[item].value.vehicleID.length;
      driverInfo["vehicles"] = [];
      driverInfo["vehicles"].push(vehicleDetails[item]);
      driverInfo["noOfCashTrips"] = cashTripsInfo[item];
      driverInfo["noOfNonCashTrips"] = nonCashTripsInfo[item];
      driverInfo["totalAmountEarned"] = +totalEarningsInfo[item].toFixed(2);
      driverInfo["totalCashAmount"] = totalCash[item];
      driverInfo["totalNonCashAmount"] = +totalNonCash[item].toFixed(2);
      driverInfo["trips"] = userDetails[item];
    }
    driverArray.push(driverInfo);
  }
  return driverArray;

}


module.exports = driverReport;
