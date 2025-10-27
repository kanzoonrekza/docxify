FROM node:20

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if you have one)
COPY package.json pnpm-lock.yaml* ./

# Set up pnpm to use a shared store
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /pnpm/store

# Install dependencies
RUN pnpm install
# Install drizzle-kit
RUN pnpm add -D drizzle-kit

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app
RUN pnpm run build

EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]