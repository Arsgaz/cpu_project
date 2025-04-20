import mysql from "mysql2";
  
// create the connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Asasin_50',
  database: 'cpu'
});
 
export default db;