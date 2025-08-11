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
migrate-to-derivable.js
- Takes decrypted entries (you must supply master) and rewrites them as derivable entries.
Usage:
node migrate-to-derivable.js <masterPassword> <id> [--length 16]
*/
const { getEntryById, setMeta } = require('./db');
const { getMeta } = require('./db');
const { initDb } = require('./db');
const { deriveKey } = require('./deriveKey');
const { insertEntry } = require('./db');
const crypto = require('crypto');

// This script assumes you will manually read the plaintext (using getEntry)
// then run this to create a derivable metadata entry and remove old one.
// For safety, this script just prints the suggested derivation metadata.

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    const master = args[0];
    const id = parseInt(args[1], 10);
    const length = parseInt(args[3] || '16', 10);
    if (!master || !id) {
      console.error('Usage: node migrate-to-derivable.js <masterPassword> <id> [--length 16]');
      process.exit(1);
    }
    console.log('Run `node getEntry.js', id, master, '` to read the plaintext first.');
    console.log('Then choose derivation params. Suggestion:');
    const suggestion = { derivable: true, version: 'v1', counter: 1, length, site: 'site.example', username: '' };
    console.log(JSON.stringify(suggestion, null, 2));
    console.log('To apply, run storeEntry with --derivable and appropriate flags.');
  })();
}
