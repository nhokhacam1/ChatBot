'use strict';
const axios = require('axios');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
   function timKiemHandler(agent){
    const msv = agent.parameters.hovaten;
     var url=encodeURI(`https://thongtinsinhvien.azurewebsites.net/api/thongTinmess?msv=${msv}&loai=timtheoten`); 
    return axios.get(url)
    .then((result) => {
        result.data.map(thongBao => {
        	agent.add(thongBao.messages);
        });
    });
  }
  function diemSoHandler(agent){
    const msv = agent.parameters.maSinhVien;
    return axios.get(`https://thongtinsinhvien.azurewebsites.net/api/thongTinmess?msv=${msv}&loai=diemso`)
    .then((result) => {
        result.data.map(thongBao => {
        	agent.add(thongBao.messages);
        });
    });
  }
  function thongTinHandler(agent){
  const msv = agent.parameters.maSinhVien;
    return axios.get(`https://thongtinsinhvien.azurewebsites.net/api/thongTinmess?msv=${msv}&loai=thongtinsinhvien`)
    .then((result) => {
        result.data.map(thongBao => {
        	agent.add(thongBao.messages);
        });
    });
  }
  function diemSoTheoKyHandler(agent){
    const msv = agent.parameters.maSinhVien;
    const ky= agent.parameters.hocKy;
    const namHoc=agent.parameters.namHoc;
    return axios.get(`https://thongtinsinhvien.azurewebsites.net/api/thongBaoDiemTheoKy?msv=${msv}&ky=${ky}&namHoc=${namHoc}`)
    .then((result) => {
        result.data.map(thongBao => {
        	agent.add(thongBao.messages);
        });
    });
  }
  let intentMap = new Map();
  intentMap.set('timKiem', timKiemHandler); //khi intent được gọi -> chạy hàm
  intentMap.set('thongTinSinhVien', thongTinHandler);
  intentMap.set('diemSoSinhVien', diemSoHandler);
  intentMap.set('diemSoSinhVienTheoKy', diemSoTheoKyHandler);
  intentMap.set('Wellcome', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap);
});