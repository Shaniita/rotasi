const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const logFilePath = path.join(__dirname, 'rotasi_log.txt');

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `${timestamp}: ${message}\n`);
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} menit ${seconds} detik`;
}

async function runRotasi(startDate, endDate, dept, divisi) {
  let connection;
  const startTime = Date.now();

  try {
    connection = await mysql.createConnection(DB_CONFIG);

    const procedureQuery = 'CALL generate_rotasi01(?, ?, ?, ?)';
    await connection.execute(procedureQuery, [
      startDate,
      endDate,
      dept || 'null',
      divisi || 'null'
    ]);

    const durationMs = Date.now() - startTime;
    const successMessage = `SUKSES generate rotasi dari ${startDate} sampai ${endDate} (waktu proses: ${formatDuration(durationMs)})`;
    log(successMessage);
    return successMessage;
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const errorMessage = `GAGAL! Error: ${err.message} (waktu proses: ${formatDuration(durationMs)})`;
    log(errorMessage);
    throw new Error(errorMessage);
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = { runRotasi };
