#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.16.2 AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./
COPY src/ ./src
COPY .env ./

RUN yarn install --frozen-lockfile && yarn build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:12.16.2-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
COPY .env ./

RUN yarn install --frozen-lockfile --production

RUN ls -la
# RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist

COPY views ./views

# # Copy in our environment variables
# COPY .env .

CMD ["node", "dist/server.js"]