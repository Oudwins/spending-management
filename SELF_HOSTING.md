# Self Hosting

Self-hosting this app is very simple.

## What you need

- A reachable CouchDB instance.
- A database named `spending`.
- A CouchDB user with read/write access to that database.
- HTTPS if the server is exposed on the public internet.

That is it. There is no separate backend, worker, or API service to run.

## How the app connects

The app syncs directly with a CouchDB database URL, for example:

```text
https://user:password@your-couchdb.example.com:5984/spending
```

The database URL is configured in the app settings.

## Sync behavior

- The app stores data locally first.
- It then starts continuous two-way replication with CouchDB.
- Changes made on the device are pushed to CouchDB.
- Changes already in CouchDB are pulled back to the device.
- Sync automatically retries when the network comes back.

In practice, CouchDB acts as the central sync target for all devices using the same database.

## Conflict resolution

The app relies on CouchDB/PouchDB replication semantics.

- If two devices change the same document before they sync, CouchDB keeps the conflicting revisions.
- CouchDB automatically selects a winning revision, so sync continues without manual server-side intervention.
- No extra conflict-resolution service is required for self-hosting.

## Web builds

If you use the web app against a CouchDB server on another origin, enable CORS on CouchDB for your web app origin.

The app expects CouchDB to allow the local app origins used by the web build and Capacitor shells. A configuration equivalent to this is required:

```ini
[chttpd]
enable_cors = true

[cors]
origins = http://localhost,https://localhost,capacitor://localhost,ionic://localhost
credentials = true
methods = GET, PUT, POST, HEAD, DELETE, OPTIONS
headers = accept, authorization, content-type, origin, referer, x-requested-with, if-match, if-none-match
exposed_headers = location, etag

[log]
level = info
```

Without this, browser and mobile-webview requests to CouchDB will be blocked by CORS and sync will not work.

## Minimal checklist

1. Run CouchDB.
2. Create the `spending` database.
3. Create a user that can read and write that database.
4. Put the full database URL into the app settings.

Once that is done, the app will replicate to your CouchDB instance.
