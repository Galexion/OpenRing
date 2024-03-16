import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("./database.db")

import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

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
});

export function checkUserExists(user: string): Promise<boolean> {
    const sanitizedUsername = sanitizeInput(user);
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as count FROM ringData WHERE username = ?';
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
    `;const sql2 = `
    INSERT INTO userData (username, password, website, visible)
    VALUES (?, ?, ?, ?)
  `;

    return new Promise((resolve, reject) => {
        db.run(sql, [sanitizedUsername, sanitizedWebsite, null, null,true], (err) => {
            if (err) {
                console.error(err.message);
                reject({ "error": err.message })
            } else {
                console.log('Row inserted successfully'); db.run(sql2, [sanitizedUsername, hashPassword(pass), sanitizedWebsite, true], (err) => {
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