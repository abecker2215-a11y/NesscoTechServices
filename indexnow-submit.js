const https = require('https');
const fs = require('fs');
const xml = fs.readFileSync('D:/PROJECTS/msp-website/public/sitemap-0.xml','utf8');
const urls = [];
const re = /<loc>(.*?)<\/loc>/g;
let m; while((m=re.exec(xml))) { if (m[1]) urls.push(m[1]); }
const body = JSON.stringify({host:'nesscotech.com', key:'52dde6db977d403bb482d78f36f1bf76', keyLocation:'https://nesscotech.com/52dde6db977d403bb482d78f36f1bf76.txt', urlList: urls});
const req = https.request('https://api.indexnow.org/indexnow', {method:'POST', headers:{'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body)}}, (res)=>{
  console.log(res.statusCode);
});
req.on('error',e=>{console.log('err');});
req.write(body);
req.end();
