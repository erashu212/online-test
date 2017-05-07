[![Build Status](https://travis-ci.org/m19g/online-test.svg?branch=master)](https://travis-ci.org/m19g/online-test)
[![dependencies Status](https://david-dm.org/m19g/online-test/status.svg)](https://david-dm.org/m19g/online-test)
[![devDependencies Status](https://david-dm.org/m19g/online-test/dev-status.svg)](https://david-dm.org/m19g/online-test?type=dev)

# Online Interview App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Node.js 6.9 or later
```

### Installation
```
npm install
```

### Configuration
Save your Firebase service account's json key at `server/firebase.admin.credential.json`.  Please refer to https://firebase.google.com/docs/admin/setup for obtaining private key file.

Update `./src/app/login/login.module.ts`'s `firebaseConfig` variable to your Firebase client config.  Update `server/firebase.auth.js`'s `databaseURL` to your Firebase client config's `databaseURL`.  Please refer to https://firebase.google.com/docs/web/setup for obtaining Firebase client config.

### Start
 ```
 npm run start.client (to start client only)
 ```

 ```
 npm run start.server (to start server only)
 ```

 ```
 npm start
 ```
 Browse the http://localhost:4200

 ## Authors

* **Ashutosh Singh** [Developer](https://github.com/erashu212)
* **Kibeom Kim**     [Developer](https://github.com/m19g)

**[M19G Inc.](http://www.m19g.com) holds the copyright.**


## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
