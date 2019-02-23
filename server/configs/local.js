const dbport = process.env.DBPORT || 27017;	
export let localConfig = {    	
    hostname : 'localhost',	
    port : process.env.PORT || 80,    	
    dbport : dbport,	
    dbname : process.env.DBNAME || `zealotrydb`,	
    dburl : process.env.MONGODB_URI || `mongodb://localhost:${dbport}`	
} 