// acesso á variáveis de ambiente
require('dotenv').config();

// requisição da dependência MySQL ou SQL Server
const mysql = require('mysql2'); 
const sql = require('mssql');

// instancia para a conexão com o MySQL
const mySqlConfig = {
    host: process.env.DB_HOST, // servidor localhost
    user: process.env.DB_USER, // super usuário root
    password: process.env.DB_PASSWORD, // senha do super usuário
    database: process.env.DB_NAME, // banco selecionado
};

// instancia para a conexão com SQL Server (Azure Cloud)
var sqlServerConfig = {
    server: process.env.DB_HOST, // link do servidor cloud
    user: process.env.DB_USER, // super usuário root
    password: process.env.DB_PASSWORD, // senha do super usuário
    database: process.env.DB_NAME, // banco selecionado
    pool: {
        max: 10, // máximo de conexão por "pool", por conexão pool
        min: 0, // mínimo de conexão por pool
        idleTimeoutMillis: 30000 // tempo de inatividade antes de encerrar a conexão, a cada pool
    },
    options: {
        encrypt: true, // conexões devem ser criptografadas
    }
}


function execute(sqlCommand) { // função recebe um parametro, que é a intrução sql

    // verificar se o ambiente é produção ou desenvolvimento*
    // verificar as credenciais através do .env *

    if (process.env.NODE_ENV == "production") {
        // se ambiente é de produção (usar o Azure Cloud, SQL Server)
        return new Promise(function (resolve, reject) { // cria uma promessa 
            sql.connect(sqlServerConfig).then(function () { // conectar com as credenciais definida
                return sql.query(sqlCommand); // então retornar o valor da query com a instrução no "sql command"
            }).then(function (result) { // usar o resultado da query
                console.log(result); // para apresentar no console
                resolve(result.recordset); // e solucionar a promessa
            }).catch(function (error) { // caso um problema aconteça no processo
                reject(error); // quebra a promessa
                console.log(`\x1b[31m Error when executing SQL command: \n\x1b[0m ${error}`); // e apresenta o erro
            });

            // Captura eventos de erro na conexão com o SQL Server
            sql.on('error', function (error) {
                return (`\x1b[31m Some error happened in SQL Server (Azure Cloud): \n\x1b[0m ${error} `);
            });
        });
    } else if (process.env.NODE_ENV == "development") {
        
        // se ambiente de desenvolvimento (usar o localhost, MySQL)
        return new Promise(function (resolve, reject) {
            var connection = mysql.createConnection(mySqlConfig); // faz uma instancia com as credenciais definida
            connection.connect(); // abre a conexão
            connection.query(sqlCommand, function (error, result) { // executa uma query com a instrução no "sql comand"
                connection.end(); // finaliza a conexão
                if (error) { // em caso de erro
                    reject(error); // quebre a promessa
                }
                console.log(result); // apresente o resultado 
                resolve(result); // solucione a promessa
            });

            // Captura eventos de error na conexão com o MySQL Workbench
            connection.on('error', function (error) {
                return (`\x1b[31m Some error happened MySQL (Workbench localhost):\n\x1b[0m ${error.sqlMessage}`);
            });
        });
    } else {
        // variáveis de ambiente deve ser setadas antes de conectar
        return new Promise(function (resolve, reject) {
            console.log(`\x1b[31m\nSet the NODE_ENV environment variable to 'production' or 'development' at .env file\n\x1b[0m`);
            reject("Environment variable not set in .env")
        });
    }
}


module.exports = {
    execute
}