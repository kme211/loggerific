# Loggerific

Simple back/front end for logging messages to [mlab.com](https://mlab.com) (hosted MongoDB).

## Why?

This is something I created because I needed a way to see log statements from a Flash app. It was going to be tested by multiple people and I 
wanted a record of their experiences since the app was so dynamic.

## Getting started

### Installation

Copy the files to your machine with `git clone https://github.com/kme211/loggerific.git`.

Install the dependencies with `npm install`.

### Configuring for your MongoDB database

Create a `.env` file in the root directory and populate with your MongoDB info. This info will be used for testing.

```
DB_HOST=<db host>
DB_USER=<db user>
DB_PASS=<db password>
```

Run app with `npm run dev`.

## Logging messages

You will need to create a session by sending a GET request to your loggerific server. 

`GET http://yourloggerificserver.com/api/session`

```
 // Returns JSON with session id
 {
   "id": "58e45bcfacf1d1540413eee3"
 }
```

You can then send POST request with the session id and your messages to your loggerific server.

`POST http://yourloggerificserver.com/api/log`

```
 // Send a JSON body with session id and messages
 {
     "sessionId": "58e45bcfacf1d1540413eee3",
      "messages": [
          {
              "type": "Can be whatever you want",
              "body": "Test message.",
              "date": "2017-04-05 15:59:23"
          }
      ]
 }
```

I would suggest batching your messages by using a [debounce](https://davidwalsh.name/javascript-debounce-function) function.

## Viewing messages

Go to `http://yourloggerificserver.com` to view the sessions. You can see how many messages each session has on this screen. Sessions 
that have a message (or more) with the word "error" (case insensitive) in the body of the message will be hightlighted red(ish).
You can click on the session to see the messages. Messages with the word "error" in the body will be highlighted.

## Deploying to Heroku

Follow the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) tutorial if you aren't already familiar with Heroku.

Don't forget to [define your config vars](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars) for `DB_HOST`, `DB_USER`, and `DB_PASS`.