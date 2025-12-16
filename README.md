Follow these steps to add new papers:
1. clone this repository
2. docker-compose build
3. docker-compose run --rm -it doi-fetcher
4. collect the new paper data in data/papersData.json

If there is a problem with docker in Step 3 rebuild the app by running:

docker-compose down
docker-compose build

then retry step 3
