let express = require("express")
let app = express()
let fs = require('fs');
let https = require('https');
let http = require('http').createServer(app)
let port = 2096
let cors = require('cors')
// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem')
};

app.use(cors())

let server = https.createServer(options, app) 

// console.log(fs.readFileSync('cert/cert.pem'));
let io = require('socket.io')(server,{
    cors: {
        origin: "*"
    }
  })

let dataToken = []
let dataCurang = []

server.listen(port,()=>{console.log(`server ssl running in ${port}`);});


io.on('connection',(socket)=>{
    console.log('user connected');
    // io.emit('mapels',dataUjian)

    socket.on('mapel',(data)=>{   
        io.emit('mapels',data)
    })

    socket.on('loadData',(a)=>{
        io.emit('loadDatas',a)
    })

    socket.on('resetPeserta',()=>{
        dataCurang = []
        io.emit('resetPesertas')
        io.emit('detekCurangs',(dataCurang))
    })
    socket.on('resetSiswa',(data)=>{
        // console.log(data);
        if(dataCurang.length){
            let i = dataCurang.findIndex((a)=>{return a._id == data})
            delete dataCurang[i].curang
            io.emit('detekCurangs',(dataCurang))
        }
        io.emit('resetSiswas',(data))
        
    })
    socket.on('selesaiUjian',(data)=>{
        io.emit('laporSelesai',data)
    })

    socket.on('detekCurang',(d)=>{
        if(d != undefined || d!= null){
            let i = dataCurang.findIndex((a)=>{return a._id == d._id})
            if(i == -1){
                dataCurang.push(d)
            }else{
                dataCurang[i] = d
            }
        }
        io.emit('detekCurangs',(dataCurang))
        // console.log(id);
    })
    // io.emit('detekCurangs',(dataCurang))

    socket.on('kirimToken',(d)=>{
        if(d != undefined || d!= null){
            let i = dataToken.findIndex((a)=>{return a.kelas == d.kelas})
            if(i == -1){
                dataToken.push(d)
            }else{
                dataToken[i] = d
            }
        }
        io.emit('sendToken',dataToken)
    })

    socket.on('aksiSiswa',(a)=>{
        io.emit('aksiSiswas',a)
    })

    socket.on('ulHarian',()=>{
        io.emit('ulHarians')
    })    

    socket.on('mintaData',()=>{
        io.emit('detekCurangs',(dataCurang))
        // io.emit('sendToken',dataToken)
    })

    socket.on('capture siswa',(data)=>{
        
        io.emit('cekrek',(data))
    })

    socket.on('kirim foto',(data)=>{
        // console.log(data);
        io.emit('terima foto',data)
    })

})