# Retirement intake attachments — backend handoff

The public Get Started form now sends the existing retirement-intake submission and optional supporting files to:

`POST /api/crm/retirement-intake-submissions`

## Request format

Change this endpoint from JSON-only handling to `multipart/form-data`. The browser supplies the multipart `Content-Type` boundary.

| Part name | Type | Required | Description |
| --- | --- | --- | --- |
| `payload` | String containing JSON | Yes | The existing `RetirementIntakeSubmission` object. Its fields and validation rules are unchanged. |
| `attachments` | File, repeated | No | Zero to three supporting files. The same part name is repeated for every file. |

Example structure:

```text
payload: {"firstName":"Jane","lastName":"Doe",...,"privacyConsent":true}
attachments: account-statement.pdf
attachments: supporting-photo.jpg
```

The request continues to include:

```http
Accept: application/json
Idempotency-Key: <unique-request-id>
```

## Attachment limits

- Maximum 3 files
- Maximum 10 MB per file
- Maximum 25 MB across all files
- Any file extension or MIME type may be submitted

Enforce every limit on the server even though the frontend also validates them. Return HTTP `422` for attachment validation failures:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Check the highlighted fields.",
    "fields": {
      "attachments": "Attach no more than 3 files."
    }
  },
  "requestId": "request-id"
}
```

Use the field key `attachments` so the public website can show the message beside the file picker.

## Storage and security requirements

- Store uploads in private, access-controlled object storage; do not create public file URLs.
- Generate server-side storage keys. Treat the supplied filename as display metadata only and sanitize it before saving or returning it.
- Stream uploads and enforce request/file limits while parsing to avoid buffering unbounded data in memory.
- Malware-scan or quarantine every upload. Accepting any file type must never mean executing or rendering an uploaded file on the server.
- Associate stored attachment metadata with the created CRM submission: original filename, storage key, byte size, detected MIME type, and upload timestamp.
- Never log file contents, SSN/Tax ID values, or raw multipart bodies.
- Preserve current authentication, rate-limiting, CORS, and idempotency behavior. Repeating an `Idempotency-Key` must not create duplicate records or duplicate stored files.
- If submission creation fails after upload, delete the orphaned objects. If upload fails, do not create a partial CRM submission.

## Successful response

Keep the existing response contract:

```json
{
  "submission": {
    "id": "submission-id",
    "status": "received"
  },
  "requestId": "request-id"
}
```

The other public form endpoints remain JSON-only and require no changes.
