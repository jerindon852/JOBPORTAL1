FROM node:20
WORKDIR /jobportal
COPY index.html .
COPY style.css .
COPY script.js .
EXPOSE 3000
CMD ["npx", "serve"]
