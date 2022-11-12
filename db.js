const mysql = require('mysql')

var connection

class DB {
	constructor(host, port, username, password, database) {
		connection = mysql.createConnection({
			host: host,
			port: port,
			user: username,
			password: password,
			database: database
		})

		connection.connect(err => {
			if (err) throw err

			console.log('connected to database!')
		})
	}

	getConnection() {
		return connection
	}

	select(fields, table, opt, callback) {
		let sql = 'SELECT '
		fields.forEach(field => {
			sql += `${field},`
		})
		sql = sql.substring(0, sql.length - 1)
		sql += ` FROM ${table}`

		if (opt.condition) {
			sql += ` WHERE ${opt.condition}`
		}
		
		connection.query(sql, (err, result) => {
			if (err) throw err

			callback(result)
		})
	}

	insert(data, table, callback) {
		let keys = Object.keys(data)
		let values = Object.values(data) 
		let numValues = values.length

		connection.query(`INSERT INTO ${table} (${keys.join()}) VALUES (${Array(numValues).fill('?').join()})`, values, (err, result) => {
			if (err) throw err

			callback(result)
		})
	}
}

module.exports = DB