## Getting Started

Use node v18.17.0

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Modify the `"dev": "next dev -p 3000",` command in `package.json`. The default `port` is specified to be `3000`.

Open [http://localhost:3000] with your browser to see the result.


## Docker build

docker build -t 3d-editor .

docker run -p 8080:3000 3d-editor

Open [http://localhost:8080] with your browser to see the result.
