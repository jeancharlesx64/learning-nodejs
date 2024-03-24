require('dotenv').config(); // permitindo acesso à variáveis de ambiente .env

const express = require('express'); // instância do framework express
const app = express(); // inicializando o express
const path = require('path'); // permite o melhor manuseio de caminhos de diretórios
const cors = require('cors'); // permite que outros domínios façam requisições, serve para a criação de uma API 


app.use(express.json()); // permite a manipulação dos JSONs e ser acessível nos "reqs", pra manipular em rota
app.use(express.urlencoded({ // permite as análise de dados vindo de formulários que vem codificado na URL por meio do HTTP (POST,PUT)
    extended: false // não permitindo requisições complexas ou extensas, para evitar DoS
})); 
app.use(cors()); // utilizando o cors para dar permissão a outros fazerem requisições à minha API


app.use(express.static( // permite arquivos estáticos como CSS, JS, Imagens, dentro do diretório public
    path.join(__dirname, 'public') // faz a concatenação do caminho raiz do projeto + public
)); 
// Configura o Express para usar o mecanismo de template ejs
app.set('view engine', 'ejs');
// Define o diretório onde estão os arquivos de visualização (views) usando template EJS 
app.set('views', path.join(__dirname, 'src', 'views'));


// definição de rotas genéricas
var indexRouter = require("./src/routes/index");
var userRouter = require("./src/routes/user");

app.use('/', indexRouter); // raiz
app.use('/user', userRouter); // raiz+user


const port = process.env.PORT; // porta
const enviroment = process.env.NODE_ENV; // ambiente

// tentando uma conexão
try{
    app.listen(port, function(){ // se conectar na porta indicada, mostra o ambiente e a porta definida
        console.log(`Preparing the \x1b[33m${enviroment}\x1b[0m environment...`)
        console.log(`\x1b[32mRunning server at http://localhost:${port} \x1b[0m`)
    })
}catch(e){
    console.log(`\x1b[31mError initializing the server\x1b[0m\n${e}`) // mostra o erro que não permitiu a conexão
}