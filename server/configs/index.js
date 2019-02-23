const dbport = process.env.DBPORT || 27017;
const config = {    
    hostname : 'localhost',
    port : 80,    
    dbport : dbport,
    dbname : process.env.DBNAME || `zealotrydb`,
    dburl : process.env.MONGODB_URI || `mongodb://localhost:${dbport}`
}
export default config