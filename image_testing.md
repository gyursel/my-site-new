# Image testing rules (LLM image attachments)
- Accepted MIME types: image/jpeg, image/png, image/webp only (backend also rejects others with 415)
- Backend converts to RGB JPEG and resizes to max 1024px before base64 encoding (ai.image_to_base64)
- For animated images only frame 1 is used
- Don't send blank or solid-colour images for testing — use a real photo or an image with readable text/objects
- Flow: POST /api/files/upload?session_id=S (multipart) → file id → POST /api/chat with file_ids=[id]
