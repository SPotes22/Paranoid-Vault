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
initMaster.js
- Initializes vault: creates DB meta entries and stores Argon2 hash for master and encSalt.
Usage: node initMaster.js "MySuperSecureMasterPassword"
*/
const argon2 = require('argon2');
const crypto = require('crypto');
const { initDb, setMeta } = require('./db');

function randomHex(bytes = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}

async function init(password) {
  initDb();
  // argon2 hash for auth (non-raw, stores params)
  const authHash = await argon2.hash(password, { type: argon2.argon2id });
  const encSalt = randomHex(16); // stored salt for deriving AES key

  setMeta('authHash', authHash);
  setMeta('encSalt', encSalt);
  setMeta('lockUntil', '0');
  setMeta('failedAttempts', '0');

  console.log('Master initialized. Stored authHash and encSalt in meta.');
}

if (require.main === module) {
  const pw = process.argv[2];
  if (!pw) {
    console.error('Usage: node initMaster.js <masterPassword>');
    process.exit(1);
  }
  init(pw).catch(err => { console.error('Error initializing:', err); process.exit(1); });
}

module.exports = { randomHex };
