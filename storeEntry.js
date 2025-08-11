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
storeEntry.js
Usage:
node storeEntry.js "name" "plaintextValue" "masterPassword" [--derivable] [--site site] [--username user] [--length 16]
If --derivable is passed, it will store derivation metadata instead of plaintext ciphertext.
*/
const crypto = require('crypto');
const { getMeta, insertEntry } = require('./db');
const { deriveKey } = require('./deriveKey');
const { derivePassword } = require('./derivePassword');

async function encryptAndStore(name, plaintext, masterPassword, meta_json = null) {
  const encSalt = getMeta('encSalt');
  if (!encSalt) throw new Error('Vault not initialized. Run initMaster.js first.');

  const key = await deriveKey(masterPassword, encSalt); // Buffer 32

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  insertEntry(name, iv.toString('hex'), tag.toString('hex'), ciphertext.toString('hex'), meta_json ? JSON.stringify(meta_json) : null);
  console.log('Entry stored:', name);
}

async function storeCLI() {
  const args = process.argv.slice(2);
  const name = args[0];
  const value = args[1];
  const master = args[2];
  if (!name || !value || !master) {
    console.error('Usage: node storeEntry.js <name> <value> <masterPassword> [--derivable] [--site site] [--username user] [--length 16]');
    process.exit(1);
  }
  const flags = args.slice(3);
  const derivable = flags.includes('--derivable') || flags.includes('--candado');
  if (derivable) {
    // derive metadata and store derivation params in meta_json instead of plaintext
    const site = getFlagValue(flags, '--site') || name;
    const username = getFlagValue(flags, '--username') || '';
    const length = parseInt(getFlagValue(flags, '--length') || '16', 10);
    const version = 'v1';
    const counter = 1;
    const meta = { derivable: true, version, counter, length, site, username };
    // store the derivation metadata as meta_json, ciphertext field left empty
    await encryptAndStore(name, '', master, meta);
  } else {
    await encryptAndStore(name, value, master, null);
  }
}

function getFlagValue(flags, key) {
  const idx = flags.indexOf(key);
  if (idx === -1) return null;
  return flags[idx+1];
}

if (require.main === module) {
  storeCLI().catch(err => { console.error('Error:', err); process.exit(1); });
}

module.exports = { encryptAndStore };
