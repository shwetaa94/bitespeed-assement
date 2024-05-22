Sure, here's a README file for your project that explains the `identifyContact` logic and its conditions:

---

# Fluxkart Identifier

## Overview

The Fluxkart Identifier is a service designed to manage and identify contacts based on their email and phone number. The main logic for identifying and linking contacts is implemented in the `identifyContact` function.

## Project Structure

```plaintext
bitespeed-assesment
├── prisma
│   ├── migrations
│   ├── schema.prisma
├── src
│   ├── index.ts
│   ├── prisma.ts
│   ├── routes.ts
│   └── controllers
│       └── contactController.ts
├── tsconfig.json
└── package.json
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shwetaa94/bitespeed-assement.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd bitespeed-assement
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up Prisma:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the application:**
   ```bash
   npm start
   ```

## Identify Contact Logic

The `identifyContact` function processes incoming contact requests based on the following rules:

1. **New Contact Creation:**
   - If neither the email nor the phone number exists in the database, a new primary contact entry is created.

2. **Partial Match:**
   - If either the email or phone number exists in the database, but not both, a new secondary contact entry is created and linked to the existing primary contact.

3. **Full Match with Different Primary Contacts:**
   - If both the email and phone number exist but belong to different primary contacts, the contacts are linked, with the entry having the greater ID being marked as secondary.

## Example

### Existing Database State:

```json
[
    {
        "id": 11,
        "phoneNumber": "919191",
        "email": "george@hillvalley.edu",
        "linkedId": null,
        "linkPrecedence": "primary",
        "createdAt": "2023-04-11T00:00:00.374Z",
        "updatedAt": "2023-04-11T00:00:00.374Z",
        "deletedAt": null
    },
    {
        "id": 27,
        "phoneNumber": "717171",
        "email": "biffsucks@hillvalley.edu",
        "linkedId": null,
        "linkPrecedence": "primary",
        "createdAt": "2023-04-21T05:30:00.110Z",
        "updatedAt": "2023-04-21T05:30:00.110Z",
        "deletedAt": null
    }
]
```

### Request:

```json
{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
}
```

### New Database State:

```json
[
    {
        "id": 11,
        "phoneNumber": "919191",
        "email": "george@hillvalley.edu",
        "linkedId": null,
        "linkPrecedence": "primary",
        "createdAt": "2023-04-11T00:00:00.374Z",
        "updatedAt": "2023-04-11T00:00:00.374Z",
        "deletedAt": null
    },
    {
        "id": 27,
        "phoneNumber": "717171",
        "email": "biffsucks@hillvalley.edu",
        "linkedId": 11,
        "linkPrecedence": "secondary",
        "createdAt": "2023-04-21T05:30:00.110Z",
        "updatedAt": "2023-04-28T06:40:00.230Z",
        "deletedAt": null
    }
]
```

### Response:

```json
{
    "contact": {
        "primaryContactId": 11,
        "emails": ["george@hillvalley.edu", "biffsucks@hillvalley.edu"],
        "phoneNumbers": ["919191", "717171"],
        "secondaryContactIds": [27]
    }
}
```

## API

### Identify Contact

- **URL:** `/identify`
- **Method:** `POST`
- **Body:**
  ```json
  {
      "email": "example@example.com",
      "phoneNumber": "1234567890"
  }
  ```
- **Response:**
  ```json
  {
      "contact": {
          "primaryContactId": 1,
          "emails": ["example@example.com"],
          "phoneNumbers": ["1234567890"],
          "secondaryContactIds": []
      }
  }
  ```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

---

This README file provides a comprehensive overview of your project, including installation steps, an explanation of the identify contact logic, an example, API details, and contribution guidelines.