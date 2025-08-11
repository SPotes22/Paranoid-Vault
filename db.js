/*
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Este archivo hace parte de Paranoid Vault.
 * Copyright (C) 2025  Santiago Potes Giraldo
 *
 * Este programa es software libre: puede redistribuirlo y/o modificarlo
 * bajo los términos de la Licencia Pública General de GNU publicada por
 * la Free Software Foundation, ya sea la versión 3 de la Licencia, o
 * (a su elección) cualquier versión posterior.
 *
 * Este programa se distribuye con la esperanza de que sea útil,
 * pero SIN GARANTÍA ALGUNA; ni siquiera la garantía implícita
 * de COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
 * Consulte la Licencia Pública General de GNU para más detalles.
 *
 * Debería haber recibido una copia de la Licencia Pública General de GNU
 * junto con este programa. En caso contrario, consulte <https://www.gnu.org/licenses/>.
 */

// db.js
const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "vault.sqlite"));

function initDb() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      iv TEXT,
      tag TEXT,
      ciphertext TEXT,
      created_at INTEGER,
      meta_json TEXT
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS meta (
      k TEXT PRIMARY KEY,
      v TEXT
    );
  `).run();
}

function setMeta(k, v) {
  const s = db.prepare("INSERT OR REPLACE INTO meta (k,v) VALUES (?,?)");
  s.run(k, v);
}

function getMeta(k) {
  const r = db.prepare("SELECT v FROM meta WHERE k = ?").get(k);
  return r ? r.v : null;
}

function insertEntry(name, iv, tag, ciphertext, meta_json = null) {
  const stmt = db.prepare("INSERT INTO entries (name, iv, tag, ciphertext, created_at, meta_json) VALUES (?,?,?,?,?,?)");
  return stmt.run(name, iv, tag, ciphertext, Math.floor(Date.now()/1000), meta_json);
}

function getAllEntries() {
  return db.prepare("SELECT id, name, iv, tag, ciphertext, created_at, meta_json FROM entries").all();
}

function getEntryById(id) {
  return db.prepare("SELECT id, name, iv, tag, ciphertext, created_at, meta_json FROM entries WHERE id = ?").get(id);
}

module.exports = { db, initDb, setMeta, getMeta, insertEntry, getAllEntries, getEntryById };
