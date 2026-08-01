#flashcards

## Category buckets

1xx:::Informational — request received, continuing 2xx:::Success — request received, understood, accepted 3xx:::Redirection — further action needed (resource moved) 4xx:::Client error — bad request from the client's side 5xx:::Server error — server failed to fulfil a valid request

## 2xx — Success

200:::OK — request succeeded 201:::Created — request succeeded and a new resource was created (e.g. POST) 202:::Accepted — accepted for processing, but not completed yet (async) 204:::No Content — success, but nothing to return in the body

## 3xx — Redirection

301:::Moved Permanently — resource permanently moved to a new URL 302:::Found — resource temporarily at a different URL 304:::Not Modified — cached version is still valid, use it

## 4xx — Client error

400:::Bad Request — malformed syntax / invalid request 401:::Unauthorized — authentication required or failed (not logged in) 403:::Forbidden — authenticated, but not allowed to access this 404:::Not Found — resource does not exist 405:::Method Not Allowed — HTTP method not supported for this resource 429:::Too Many Requests — rate limit exceeded

## 5xx — Server error

500:::Internal Server Error — generic server-side failure 501:::Not Implemented — server doesn't support the functionality 502:::Bad Gateway — invalid response from an upstream server 503:::Service Unavailable — server overloaded or down for maintenance 504:::Gateway Timeout — upstream server didn't respond in time

## Common interview gotchas

What is the difference between 401 and 403?:::401 = not authenticated (who are you?). 403 = authenticated but not permitted (I know you, but no). Which code means a resource was permanently moved?:::301 Moved Permanently Which 2xx code is used for async requests that aren't finished yet?:::202 Accepted Which code means the client hit a rate limit?:::429 Too Many Requests Which code is a timeout from an upstream server?:::504 Gateway Timeout Is 301 a redirect or an error?:::Redirect (3xx). Redirects are NOT errors.
