const fs = require("fs");
const path = require("path");

const Common = require("../../ni/common");

const config = require("../app.json");

exports.saveCfg = function(ctx,data){
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(process.cwd(),config.static,"uploads/airport-cfg.json"),JSON.stringify(data),(err)=>{
      if(err){
        reject(err);
        return;
      }
      resolve({
        code:0,
        message:"ok",
        data:{
          url:"uploads/airport-cfg.json"
        }
      });
    });
  });
}
exports.aircraftid2unit = function(ctx,data){
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(process.cwd(),config.static,"uploads/aircraftid2unit.json"),JSON.stringify(data),(err)=>{
      if(err){
        reject(err);
        return;
      }
      resolve({
        code:0,
        message:"ok",
        data:{
          url:"uploads/aircraftid2unit.json"
        }
      });
    });
  });
}
