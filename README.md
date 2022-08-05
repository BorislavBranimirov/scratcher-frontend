# Scratcher

This is the frontend for a Twitter clone built with the PERN stack (PostgreSQL, Express, React, Node.js).

The backend repo can be found here: [Backend Repo](https://github.com/BorislavBranimirov/scratcher-backend)

## Getting Started

Run the project by following these instructions:

- Install all dependencies from the root folder with `npm install`
- Create a `.env.local` file in the root folder and fill it with the appropriate variables
  - REACT_APP_AXIOS_BASE_URL - URL of the API server to prepend to axios requests. If not specified, defaults to `http://localhost:8000`.
  - REACT_APP_CLOUDINARY_CLOUD_NAME - The cloud name on Cloudinary where the images are hosted
- Run the suitable npm script

```sh
# Run the client in development mode on port 3000 (by default)
npm start

# Build the client for production and output it to the build folder
npm run build

# Open the Cypress app
npm run cypress:open

# Run Cypress tests (requires that the client is already started)
npm run cypress:run
```

## Author

Borislav Branimirov

## License

This project is licensed under the MIT License
