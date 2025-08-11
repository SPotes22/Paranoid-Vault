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
getEntry.js
Usage:
node getEntry.js <id> <masterPassword> [--list]
If entry.meta_json contains { derivable: true, ... } it'll derive the password deterministically.
*/
const crypto = require('crypto');
const { getMeta, getEntryById, getAllEntries, setMeta } = require('./db');
const argon2 = require('argon2');
const { deriveKey } = require('./deriveKey');
const { derivePassword } = require('./derivePassword');

function checkLock() {
  const lockUntil = parseInt(getMeta('lockUntil') || '0', 10);
  const now = Math.floor(Date.now() / 1000);
  if (now < lockUntil) {
    throw new Error('Vault locked due to failed attempts. Try later.');
  }
}

async function verifyMaster(masterPassword) {
  const authHash = getMeta('authHash');
  if (!authHash) throw new Error('No auth configured.');
  try {
    return await argon2.verify(authHash, masterPassword);
  } catch (e) {
    return false;
  }
}

async function decryptEntry(id, masterPassword) {
  checkLock();
  const ok = await verifyMaster(masterPassword);
  if (!ok) {
    let fa = parseInt(getMeta('failedAttempts') || '0', 10) + 1;
    setMeta('failedAttempts', fa.toString());
    if (fa >= 5) {
      const lockUntil = Math.floor(Date.now() / 1000) + 15*60;
      setMeta('lockUntil', lockUntil.toString());
      console.error('Too many failures, vault locked 15 minutes.');
    }
    throw new Error('Master password incorrect.');
  }
  setMeta('failedAttempts', '0');
  setMeta('lockUntil', '0');

  const entry = getEntryById(id);
  if (!entry) throw new Error('Entry not found');

  if (entry.meta_json) {
    // attempt to parse derivation metadata
    try {
      const meta = JSON.parse(entry.meta_json);
      if (meta.derivable) {
        // derive password deterministically
        const pwd = await derivePassword(masterPassword, meta.site, meta.username, { length: meta.length });
        return { id: entry.id, name: entry.name, derived: true, password: pwd };
      }
    } catch (e) {
      // fallthrough to decrypt
    }
  }

  const encSalt = getMeta('encSalt');
  const key = await deriveKey(masterPassword, encSalt);

  const iv = Buffer.from(entry.iv, 'hex');
  const tag = Buffer.from(entry.tag, 'hex');
  const ciphertext = Buffer.from(entry.ciphertext, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return { id: entry.id, name: entry.name, plaintext };
}

// CLI
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    const idOrList = args[0];
    const master = args[1];
    if (!idOrList || !master) {
      console.error('Usage: node getEntry.js <id|0 (for list)> <masterPassword> [--list]');
      process.exit(1);
    }
    try {
      if (idOrList === '0') {
        const rows = getAllEntries();
        console.log('Entries:');
        for (const r of rows) {
          console.log(r.id, r.name, r.meta_json ? '[meta]' : '');
        }
        process.exit(0);
      }
      const res = await decryptEntry(parseInt(idOrList, 10), master);
      console.log('Entry:', res);
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
  })();
}
