import sqlite3 from "sqlite3";

const db = new sqlite3.Database("my_readings.sqlite", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Errore durante l'apertura del database:", err.message);
    } else {
        console.log("Connessione al database riuscita.");
    }
});

