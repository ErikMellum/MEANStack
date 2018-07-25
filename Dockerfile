## Install PHP dependencies
FROM node:4
WORKDIR /recipestacker
COPY app /recipestacker
COPY package.json /recipestacker
COPY bower.json /recipestacker
COPY gulpfile.js /recipestacker
RUN npm install
RUN ./node_modules/bower/bin/bower install --allow-root
RUN ./node_modules/gulp/bin/gulp.js build
EXPOSE 3000
CMD [ "node", "./bin/www" ]