import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("./database.db")

import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
}

function sanitizeInput(input: string): string {
    return input.replace(/'/g, "''");
}

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS ringData (webring_id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT NOT NULL UNIQUE,website TEXT NOT NULL UNIQUE,buttonGif TEXT,profilePicture TEXT, visible BOOLEAN); ");
    db.run("CREATE TABLE IF NOT EXISTS userData (webring_id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT NOT NULL UNIQUE,password TEXT NOT NULL,email TEXT UNIQUE,website TEXT NOT NULL UNIQUE, visible BOOLEAN);");
    db.run("CREATE TABLE IF NOT EXISTS userTokens (token_id INTEGER PRIMARY KEY AUTOINCREMENT,webring_id INTEGER,token TEXT NOT NULL UNIQUE);");
});

export function checkUserExists(user: string): Promise<boolean> {
    const sanitizedUsername = sanitizeInput(user);
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as count FROM userData WHERE username = ?';
        db.get(query, [sanitizedUsername], (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
} export function checkSiteExists(site: string): Promise<boolean> {
    const sanitizedWebsite = sanitizeInput(site);
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as count FROM ringData WHERE website = ?';
        db.get(query, [sanitizedWebsite], (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
}

export async function createUser(user: string, pass: string, website: string) {
    const sanitizedUsername = sanitizeInput(user);
    const sanitizedWebsite = sanitizeInput(website);

    const sql = `
      INSERT INTO ringData (username, website, buttonGif, profilePicture,visible)
      VALUES (?, ?, ?, ?, ?)
    `;
    const sql2 = `
    INSERT INTO userData (username, password, website, visible)
    VALUES (?, ?, ?, ?)
  `;

    return new Promise((resolve, reject) => {
        db.run(sql, [sanitizedUsername, sanitizedWebsite, null, null, true], async (err) => {
            if (err) {
                console.error(err.message);
                reject({ "error": err.message })
            } else {
                console.log('Row inserted successfully');
                db.run(sql2, [sanitizedUsername, await bcrypt.hash(pass, 10), sanitizedWebsite, true], (err) => {
                    if (err) {
                        console.error(err.message);
                        reject({ "error": err.message })
                    } else {
                        console.log('Row inserted successfully');
                        resolve({ "status": "success" })
                    }
                });
            }
        });
    });
}


export async function verifyToken(token: string, webring_id:number) {
    const query = 'SELECT * FROM userTokens WHERE token = ?';

    return new Promise((resolve, reject) => {
        db.get(query, [token], async (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                console.log(webring_id)
                if(row.webring_id == webring_id) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        });

    })
}

export async function authenticateUser(user: string, pass: string) {
    const sanitizedUsername = sanitizeInput(user);
    const sanitizedPassword = sanitizeInput(pass);

    const query = 'SELECT * FROM userData WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(query, [sanitizedUsername], async (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                console.log(row)
                let webring_id = row.webring_id
                let authenticated = await verifyPassword(sanitizedPassword, row.password)
                if (authenticated) {
                    const sql = `
      INSERT INTO userTokens (webring_id, token)
      VALUES (?, ?)
    `;
                    var id = crypto.randomBytes(20).toString('hex');
                    db.run(sql, [webring_id, id], (err) => {
                        if (err) {
                            console.error(err.message);
                            reject({ "error": err.message })
                        } else {
                            console.log('Row inserted successfully');
                            resolve({ "status": authenticated, "token": id, "webring_id": webring_id });
                        }
                    });

                } else {
                    resolve({ "status": authenticated });

                }
            }
        });
    });
}

export function getWebringData(): Promise<any> {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ringData', (err, rows) => {
            if (err) {
                console.error('Error Processing Ring Data', err.message);
                return reject("Couldn't Process Ring Data.");
            }
            resolve(rows);
        });
    });
}

export function updateWebringData(buttonGif:string,ProfilePicture:string,webring_id:number): Promise<any> {
    return new Promise((resolve, reject) => {
        db.all(`UPDATE ringData SET buttonGif="${buttonGif}", profilePicture="${ProfilePicture}" WHERE webring_id=${webring_id}`, (err, rows) => {
            if (err) {
                console.error('Error Processing Ring Data', err.message);
                return reject("Couldn't Process Ring Data.");
            }
            resolve(true);
        });
    });
}

export function nextWebsite(webring_id:number) {
    const query = 'SELECT * FROM ringData WHERE webring_id = (SELECT MIN(webring_id) FROM ringData WHERE webring_id > (SELECT webring_id FROM ringData WHERE webring_id = ?)) LIMIT 1;';
    const query2 = 'SELECT * FROM ringData WHERE webring_id = (SELECT MIN(webring_id) FROM ringData WHERE webring_id < (SELECT webring_id FROM ringData WHERE webring_id = ?)) OR webring_id = ( SELECT MAX(webring_id) FROM ringData) LIMIT 1;';

    return new Promise((resolve, reject) => {
        db.get(query, [webring_id], async (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                if(row) {
                    resolve(row)
                } else {
                    db.get(query2, [webring_id], async (err, row: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row)
                        }
                    });
                }
            }
        });
    });
}

export function previousWebsite(webring_id:number) {
    const query = 'SELECT * FROM ringData WHERE webring_id = ( SELECT MAX(webring_id) FROM ringData WHERE webring_id < (SELECT webring_id FROM ringData WHERE webring_id = ?)) OR webring_id = ( SELECT MAX(webring_id) FROM ringData) LIMIT 1';

    return new Promise((resolve, reject) => {
        db.get(query, [webring_id], async (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(row)
            }
        });
    });
}