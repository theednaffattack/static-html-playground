# Notes

### Issues with TypeScript

- ES6 module fix
  https://blog.rendall.dev/posts/2019/1/14/problem-typescript-adds-objectdefinepropertyexports-esmodule-value-true/

## Docker Process

### Build locally

`docker build -t theednaffattack/static:init .`

### Run locally

`docker run --rm static`

### Build and push to Docker Registry

build: `docker build -t theednaffattack/static:init .`

push: `docker push theednaffattack/static`

docker build -t theednaffattack/travel-server:init . && docker push theednaffattack/travel-server

combined: `docker build -t theednaffattack/static:init . && docker push theednaffattack/static`

### Build and Run locally

`docker build -t theednaffattack/static:init . && docker run --rm `

### Pull down built images from Docker Registry (from prod server)

`docker-compose pull && docker-compose up`

### Find images

`docker images | grep "static"`
