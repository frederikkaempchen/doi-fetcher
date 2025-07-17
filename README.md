Follow these steps to add new papers:
1. ssh into server
2. Move to directory with the docker container
3. run the app:
   docker-compose run --rm doi-fetcher


If something doesn't work in Step 3 rebuild the app by running:

docker-compose down
docker-compose build

then retry step 3
