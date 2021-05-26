/*jshint esversion: 6 */
var express = require('express'); //import modulul express
var path = require('path'); //import modulul path
var server = express(); //aici am creat serverul
var fileupload = require("express-fileupload");
var operations = require("./resurse/scripturi/criptare"); //a luat fisierul de criptare


server.use(express.static("resurse"));

server.set('view engine', 'ejs'); //setez drept compilator de template-uri ejs (setez limbajul in care vor fi scrise template-urile)

server.use(fileupload());

//aici astept cereri de forma localhost:8080 (fara nimic dupa)
server.get('/', function (req, res) {
    res.render('pagini/index'); //afisez pagina de intrare
});

server.post('/', function (req, res) {
    res.render('pagini/signup'); //afisez pagina de intrare
});


server.post('/upload/:op', function (req, res) {
    console.log(req.files.fisier); // the uploaded file object

    var fs = require("fs");
    var operation = req.params.op;

    //asta e path-ul fisierului uploadat temporar
    path_fisier_uploadat = __dirname + '/uploads/' + req.files.fisier.name;

    var permutare = req.body.permutare;
    var cheie_Polybius = req.body.cheie_Polybius;

    // req.files.fisier.mv(fisierul_uploadat, function (err) {
    //     if (err) 
    //     {
    //         return res.status(500).send(err);
    //     }
    // });

    var input = req.files.fisier.data.toString();
    

    if (operation == 'encrypt')
    {
        fs.writeFileSync('output.txt', operations.encrypt(input, permutare, cheie_Polybius), (err) => {

            if (err) throw err;
        });
        var criptat = operations.encrypt(input, permutare, cheie_Polybius);
        var criptat1=[];
        var criptat2=[];
        for (let i=0; i<criptat.length; i++)
        {
            if (i <= 16)
                criptat1.push(criptat[i]);
            else
                criptat2.push(criptat[i]);
        }



        criptat1.join("");
        criptat2.join("");

        res.send(criptat1.concat(criptat2));
    }

    else if (operation == 'decrypt')
    {   
        var decriptat = operations.decrypt(input, permutare, cheie_Polybius);
        var decriptat_final = decriptat.join("");

        fs.writeFileSync('output.txt', decriptat_final, (err) => {

            if (err) throw err;
        });
        //console.log(typeof(decriptat_final));
        //console.log(decriptat_final);
        res.send(decriptat_final + "");
    }

    else
        res.error("Invalid op"); //nu o sa intre niciodata pe else-ul asta

});


server.get('/*', function (req, res) {
    res.render('pagini' + req.url);
    //console.log(req.url); //afisez in consola url-ul pt verificare
});

server.listen(8080);
console.log("A pornit serverul pe portul 8080");