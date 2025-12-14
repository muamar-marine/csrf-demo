# CSRF Demo

This is a prototype for CSRF (Cross-Site Request Forgery) attack demo. I am using bare minimum Nodejs as server, React as "real" client-side, and Vue as "attacker" client-side.

## How to run

### Prerequisite

Make sure you have:

1. Node.js installed
2. A PostgreSQL database running locally, or use Supabase

### Getting Started

1. Install dependencies: `$ make install-all`
2. Create the `.env` file: `$ make create-env`, then update the DB config
3. Run database migrations and seed data: `$ make migrate-db`
4. Start all services: `$ make run-all`
5. Stop all services: `$ make kill-all`

## Data

### URL

| Service          |  Type  | Is Malicious | URL                                     |
| :--------------- | :----: | :----------- | :-------------------------------------- |
| my-ginko         | Client | false        | [localhost:2000](http://localhost:2000) |
| my-ginko-server  | Server | false        | [localhost:8000](http://localhost:8000) |
| malicious-ginko  | Client | true         | [localhost:8888](http://localhost:8888) |
| malicious-server | Server | true         | [localhost:2525](http://localhost:2525) |

### User Account

For testing, please use the user below.

| Email                 | Password       | Account Number   | Act as |
| :-------------------- | :------------- | :--------------- | :----- |
| pantalone@fatui.or.ru | FatuiIzKooL234 | 1234567887654321 | User 1 |
| dottore@fatui.or.ru   | ChumIzFum909   | 8765432112345678 | User 2 |
| defalt@malicious.co   | xxx123PwNdxxx  | 1212343445455656 | Hacker |

## Scenario

With this prototype, we simulate a cross-site request forgery (CSRF) attack via phishing by stealing the user's JSON Web Token on a malicious website and sending it to a malicious server. The server then performs a POST request using cURL, since cURL requests cannot be executed from the client side. With cURL, we can bypass CORS.

### Steps

1. User 1 logs in with their credentials (you can log in as User 2 and User 3 in different browsers at the same time to verify that transfers are working correctly).
2. Perform normal activities to confirm that everything works as expected.
3. User 1 opens the [malicious website](http://localhost:8888).
4. User 1 clicks the suspicious button.
5. Check the account balance to verify whether the attack was successful.

### Explanation

When User 1 clicks the suspicious button on the malicious-website, a POST request is sent to the malicious-server with the attacker’s account number and desired amount in the request body, along with the victim’s JWT in the authorization header.

On the malicious server, the attacker has already prepared a cURL request to perform the CSRF attack using the information received from the malicious website. Since the target server does not require a CSRF token, the attacker successfully steals money from the victim.

Change the endpoint in the `malicious-server` from `transfer-unsafe` to `transfer` and observe what happens. The request will fail because it requires the `x-csrf-token` header. This protects the server from CSRF attacks.
