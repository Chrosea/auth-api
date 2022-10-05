# Before start
This project is using MongoDB as database, please install before with https://www.mongodb.com/docs/v4.2/installation/
Furthermore,  because invalidate jwt token is theoretically impossible, the workaround is to store a blacklist for jwt, this project chosen redis as solution, please install before start https://redis.io/docs/getting-started/installation/

After installation, both MongoDB and redis needs to start local service

# To start
to start with, in tht root directory install all dependency
```sh 
npm install
```

to start the service
```sh
npm run
```

to run test use
```sh 
npm test
```
