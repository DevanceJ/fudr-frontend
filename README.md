# API Endpoints

### URLs

- `/register`
- `/login`
- `/menu`
- `/admin` _(protected for staff)_
- `/orders` _(protected for staff)_
- `/add` _(protected for staff)_

### Staff Login Sample

- **Email:** abc@gmail.com
- **Password:** 12345
- _(staff accounts can be created with the following request body on register api)_
```json
{
  "email": "abc@gmail.com",
  "password": "12345",
  "username": "abc",
  "role": "admin"
}
