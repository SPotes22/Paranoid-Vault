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
/*
backup.js
Export/Import encrypted backup using master password.
Usage:
node backup.js export <masterPassword> <outFile>
node backup.js import <masterPassword> <inFile>
*/
const fs = require('fs');
const crypto = require('crypto');
const { getMeta, getAllEntries, initDb } = require('./db');
const { deriveKey } = require('./deriveKey');

function encryptBlob(key, plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString('hex'), tag: tag.toString('hex'), ciphertext: ct.toString('hex') };
}

function decryptBlob(key, obj) {
  const iv = Buffer.from(obj.iv, 'hex');
  const tag = Buffer.from(obj.tag, 'hex');
  const ct = Buffer.from(obj.ciphertext, 'hex');
  const dec = crypto.createDecipheriv('aes-256-gcm', key, iv);
  dec.setAuthTag(tag);
  return Buffer.concat([dec.update(ct), dec.final()]).toString('utf8');
}

(async () => {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const master = args[1];
  const file = args[2];
  if (!cmd || !master || !file) {
    console.error('Usage: node backup.js <export|import> <masterPassword> <file>');
    process.exit(1);
  }
  initDb();
  const encSalt = getMeta('encSalt');
  if (!encSalt) { console.error('Vault not initialized'); process.exit(1); }
  const key = await deriveKey(master, encSalt);
  if (cmd === 'export') {
    const rows = getAllEntries();
    const payload = JSON.stringify(rows);
    const blob = encryptBlob(key, payload);
    fs.writeFileSync(file, JSON.stringify(blob, null, 2));
    console.log('Exported to', file);
    process.exit(0);
  } else if (cmd === 'import') {
    const blob = JSON.parse(fs.readFileSync(file, 'utf8'));
    const payload = decryptBlob(key, blob);
    const rows = JSON.parse(payload);
    // naive import: insert rows as-is (without ids)
    for (const r of rows) {
      const meta_json = r.meta_json || null;
      // avoid duplicating ids
      const iv = r.iv || '';
      const tag = r.tag || '';
      const ct = r.ciphertext || '';
      const name = r.name || 'imported';
      const insert = require('./db').insertEntry;
      insert(name, iv, tag, ct, meta_json);
    }
    console.log('Imported', rows.length, 'entries');
    process.exit(0);
  } else {
    console.error('Unknown cmd');
    process.exit(1);
  }
})();
