# Images-Lib
Small images repository (imgur like).
User can browse all updated images, search specific images with keywords.
User can perform CRUD operations on images.

## Requirements

* Node.js - [https://nodejs.org/](https://nodejs.org/)
* MongoDB account - [https://www.mongodb.com/](https://www.mongodb.com/)
* Cloudinary account - [https://cloudinary.com/](https://cloudinary.com/)

## Getting Started

Install dependencies:

```
npm install
```

Set up .env file by replacing values with yours:

```
MONGODB_URI=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
SESSION_SECRET=uK23C4H_g6oSs1FstQ1BL
CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name
CLOUDINARY_API_KEY=sample
CLOUDINARY_CLOUD_NAME=874837483274837
CLOUDINARY_API_SECRET=a676b67565c6767a6767d6767f676fe1
```

Run the application:

```
npm start
```

The application should now be accessible at `http://localhost:3000/`
