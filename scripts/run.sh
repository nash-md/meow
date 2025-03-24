docker run -d \
  --name meow \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/meow" \
  -e SESSION_SECRET="tototatatiti" \
  -e PORT=9000 \
  -e LOG_LEVEL=info \
  -e NODE_ENV=production \
  -p 3007:80 \
  --restart always \
  killiankopp/meow:1.0