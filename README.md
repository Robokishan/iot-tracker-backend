
<h1  align="center">Welcome to Iot Tracker Backend 👋</h1>

<p>

<img  alt="Version"  src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />

<a  href="https://github.com/Robokishan/xoxo-backend#readme"  target="_blank">

<img  alt="Documentation"  src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />

</a>

<a  href="https://github.com/Robokishan/xoxo-backend/graphs/commit-activity"  target="_blank">

<img  alt="Maintenance"  src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />

</a>

<a  href="https://twitter.com/robokishan"  target="_blank">

<img  alt="Twitter: robokishan"  src="https://img.shields.io/twitter/follow/robokishan.svg?style=social" />

</a>

</p>

  

> This is the Project for iot tracker backend. it supports following things

  

### 🏠 [Homepage](https://github.com/Robokishan/xoxo-backend#readme)

# Features

 - Role based permission
 - Seprate login for admin, Client and and device
 - Device is acted as Human so that we can also track employees with the android or ios app
 - MQTT, LWM2M, Spark-protocol Supported
 - User info , Jwt token based authentication
 - Profile Picture upload and remove
 - User can add Assets, delete assets, edit assets
 - List of all apis will available after running the project

# Tasklist

 - RS485, RS232 Support
 - Can Bus support
 - Quick emergency button support

## Install

  

```sh

npm install

```

  

## Usage

- You need to create .env from .env.template and then use your credentials for postgresql , mongodb and paytm 
  

```sh

npm run start

```

  
# Docker build

### First build Docker image
```
docker build -t iot-backend -f Dockerfile .
```
### For development
```
docker run -d -p 5000:5000 -v $PWD:/usr/src/app --name iot-backend -ti iot-backend /bin/bash
```

### For Production
```
docker run --rm -p 5000:5000 --name iot-backend -ti iot-backend
```


### List of APis
```
┌────┬──────────────────────────────────┬────────┬───────┬──────┐
│    │ APi                              │ Method │ Admin │ dOne │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 0  │ /api/v1/owner/login              │ POST   │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 1  │ /api/v1/asset/login              │ POST   │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 2  │ /api/v1/assetdata/:assetId/      │ POST   │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 3  │ /api/v1/public/portfolio/main    │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 4  │ /api/v1/public/mail              │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 5  │ /api/v1/public/payment           │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 6  │ /api/v1/public/callback          │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 7  │ /api/v2/asset/data/:assetId/     │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 8  │ /api/v1/asset/p/password         │ PUT    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 9  │ /api/v1/asset/p/picture          │ PUT    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 10 │ /api/v1/util/genuuid             │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 11 │ /api/v1/util/genpass             │ POST   │ 🔐     │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 12 │ /api/v1/owner/picture            │ PUT    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 13 │ /api/v1/owner/detail             │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 14 │ /api/v1/owner/password           │ PUT    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 15 │ /api/v1/owner/asset              │ DELETE │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 16 │ /api/v1/asset                    │ GET    │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 17 │ /api/v1/asset/data/:assetId      │ GET    │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 18 │ /api/v1/asset/hits               │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 19 │ /api/v1/asset/overview           │ GET    │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 20 │ /api/v1/asset/add                │ POST   │       │ ✅    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 21 │ /api/v1/asset/detail/:assetId    │ PUT    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 22 │ /api/v1/admin/owner              │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 23 │ /api/v1/admin/owner/:owner_id    │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 24 │ /api/v1/admin/asset              │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 25 │ /api/v1/admin/overview/count     │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 26 │ /api/v1/admin/overview           │ GET    │ 🔐     │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 27 │ /api/v1/admin/all/assets         │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 28 │ /api/v1/admin/mail               │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 29 │ /api/v1/admin/type/owner         │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 30 │ /api/v1/admin/project            │ POST   │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 31 │ /api/v1/admin/project/:projectId │ PATCH  │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 32 │ /api/v1/swagger/documentation    │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 33 │ /api/v1/swagger/swagger.json     │ GET    │       │ 📌    │
├────┼──────────────────────────────────┼────────┼───────┼──────┤
│ 34 │ /api/v2/asset/overview           │ GET    │       │ 📌    │
└────┴──────────────────────────────────┴────────┴───────┴──────┘
```


  

## Author

  

👤 **Kishan Joshi**

  

* Website: https://kishanjoshi.dev

* Twitter: [@robokishan](https://twitter.com/robokishan)

* Github: [@robokishan](https://github.com/robokishan)

* LinkedIn: [@robokishan](https://linkedin.com/in/robokishan)

* Youtube: [@robokishan](https://youtube.com/robokishan)

  

## 🤝 Contributing

  

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Robokishan/xoxo-backend/issues). You can also take a look at the [contributing guide](https://github.com/Robokishan/xoxo-backend/blob/master/CONTRIBUTING.md).

  

## Show your support

  

Give a ⭐️ if this project helped you!

  

***
