import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("./database.db")

import bcrypt from 'bcrypt';
import crypto from 'crypto';
var id = crypto.randomBytes(20).toString('hex');

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
        db.run(sql, [sanitizedUsername, sanitizedWebsite, null, null,true], async (err) => {
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

export async function authenticateUser(user: string, pass: string) {
    const sanitizedUsername = sanitizeInput(user);
    const sanitizedPassword = sanitizeInput(pass);

    const query = 'SELECT * FROM userData WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(query, [sanitizedUsername], async (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(await verifyPassword(sanitizedPassword,row.password));
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