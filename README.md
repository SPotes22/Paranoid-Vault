# Paranoid Vault 
Patch 2.0
--------------------
Gestor de contraseñas por CLI que usa Argon2id y AES para derivación y cifrado. Genera contraseñas únicas y seguras sin necesidad de sincronización en la nube. Ideal para desarrolladores y usuarios que buscan seguridad moderna y control total de sus credenciales.
----
This patch integrates Argon2id-based deterministic password derivation and Argon2-based key derivation/auth.
It includes scripts:
- initMaster.js
- storeEntry.js
- getEntry.js
- derivePassword.js (uses Argon2id raw)
- deriveKey.js (AES key derivation with Argon2id raw)
- migrate-to-derivable.js
- backup.js
- db.js

DOES NOT INCLUDE 
- .env (create your own secret schema)
```
SECRET_DICT=sol,luna,mar,cafe,brisa,montaña,rio,sombra,fuego,viento,noche,dia,camino,trazo,clave,nexo,puerta,llave,eco,pulso, etc...
SECRET_BLOCKS=lorem,ipsum,example,supersecret, etc... 
```
Install:
```
  npm install
```
Usage:
* Iniciar Caja Fuerte
```
  node initMaster.js "MyMasterPassword" 
``` 
* Guardar una Contrasenia en la caja fuerte
``` 
node storeEntry.js "site" "Value" "MyMasterPassword" #simple storage
node storeEntry.js "site" "value" "MyMasterPassword" --candado   # store encrypted value
```
* Guardar Paranoicamente (tamanio ajustable)
```
  node storeEntry.js "name" "thePassword" "MyMasterPassword" --derivable --site site.example --username user --length 20
```
* Visualizar contrasenias guardadas
```
  node getEntry.js 0 "MyMasterPassword" --list
```
* Visualizar Contrasenia Por id
```
  node getEntry.js id "MyMasterPassword"
```
* Exportar Contrasenia
```
  node backup.js export "MyMasterPassword" backup.json
```
* Importar Contrasenia
```
  node backup.js import "MyMasterPassword" backup.json
```

Keep your .env and any dict files out of version control.

---
# 🔐 Password Locker — Versión con Argon2

Este proyecto genera contraseñas únicas y seguras para cada servicio usando **derivación con Argon2id** a partir de una master password.  
Nunca almacena contraseñas planas y no requiere sincronización con la nube:  
si tienes la misma master password y el mismo "nombre de entrada" (`entry name`), siempre se genera la misma contraseña.

---

## 🚀 Características
- Derivación de contraseñas con **Argon2id** (seguridad resistente a ataques GPU/ASIC).
- Contraseñas reproducibles: no dependen de una base de datos externa.
- Compatibilidad con cualquier servicio web (el servicio aplica su propio hash al recibir tu contraseña).
- Evita contraseñas fáciles o repetidas en varios sitios.

---

## 📌 Flujo de uso
Esta es una explicacion Grafica de como Funciona este Pasword Mannager.
```
┌───────────────┐
│Master Password│
└───────┬───────┘
│
▼
Argon2id Derivation
│
▼
┌──────────────────────────────┐
│ Contraseña derivada final    │ ← Ej: "Do4.J#T;-AEudHlo"
└──────────────────────────────┘
│
▼
Usar en el formulario del sitio
│
▼
┌──────────────────────────────┐
│ Sitio web hashea y almacena  │
│ (bcrypt, Argon2, PBKDF2...)  │
└──────────────────────────────┘
```
---
**Importante:**  
La contraseña que devuelve el sistema **ya está lista para usarse directamente en el sitio web**.  
No la vuelvas a cifrar ni a hashear antes de ponerla en el formulario, ya que el servicio aplicará su propio proceso interno.

---

## 📂 Ejemplo de entrada
```
{
  "id": 2,
  "name": "locker-fb",
  "derived": true,
  "password": "Do4.J#T;-AEudHlo"
}
```
name: identificador único de la cuenta (Facebook, Gmail, AWS, etc.).

password: contraseña derivada final (segura y lista para usar).

derived: indica que fue generada a partir de tu master password.
---
[![License: GPL v3 or later](https://img.shields.io/badge/License-GPLv3+-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Project Status: Actively Maintained](https://img.shields.io/badge/Status-Activo-success.svg)](#)
--- 
### BONUS

```
python3 Crack_Aproximation.py
``` 

Cómo funciona:

* Detecta qué tipos de caracteres usas (minúsculas, mayúsculas, dígitos, símbolos).

* Calcula el tamaño del charset efectivo.

* Estima la entropía en bits.

* Calcula el tiempo promedio para romperla, dado un número de intentos por segundo (gps).

* Lo devuelve en formato legible (años, días, horas, etc.).

* Con gps = 1e12 (1 billón de intentos por segundo, realista para un atacante con GPUs potentes y ataques offline)

Copyright (C) 2025 Santiago Potes Giraldo

Lo que faltaría para que esto sea “impenetrable”
- Integrar QKD con tu gestor de contraseñas.
- Usar One-Time Pads generados por el canal cuántico (cifrado perfecto).
- Hacer que la rotación de clave sea automática si se detecta cualquier alteración de los qubits.
