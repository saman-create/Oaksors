# Investment landing page lead API

Please add this public endpoint for the new `/invest` landing page:

`POST /api/crm/lead-submissions`

No authentication token is required. The frontend sends:

```http
Content-Type: application/json
Accept: application/json
Idempotency-Key: <unique-request-id>
```

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+15551234567",
  "message": "Please contact me in the afternoon.",
  "sourcePage": "invest",
  "privacyConsent": true
}
```

Required fields: `firstName`, `lastName`, `email`, `phone`, `sourcePage`, and `privacyConsent`. `message` is optional. `sourcePage` must be `invest`.

Please create a lead record in the CRM, enforce the idempotency key so repeated requests do not create duplicate leads, and apply the same validation, rate limiting, logging, and CORS rules used by the existing public CRM submission endpoints.

Success response:

```json
{
  "submission": {
    "id": "lead-record-id",
    "status": "received"
  },
  "requestId": "optional-request-id"
}
```

Validation response (`422`):

```json
{
  "error": {
    "code": "validation_error",
    "message": "Review the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address."
    }
  }
}
```

Please keep the existing public API error shape for duplicate (`409`), rate-limit (`429`), and server errors so the frontend can display the correct feedback.
