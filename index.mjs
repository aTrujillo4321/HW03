import express from 'express';
import fetch from 'node-fetch';

const plumbus = (await import('rickmortyapi')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async (req, res) => {
   const randomGifs = [
      Math.floor(Math.random() * 826) + 1, 
      Math.floor(Math.random() * 826) + 1, 
      Math.floor(Math.random() * 826) + 1, 
      Math.floor(Math.random() * 826) + 1,
      Math.floor(Math.random() * 826) + 1,
      Math.floor(Math.random() * 826) + 1,
      Math.floor(Math.random() * 826) + 1,
      Math.floor(Math.random() * 826) + 1,];
   let {data} = await plumbus.getCharacter(randomGifs);
   const gifs = Array.isArray(data) ? data : [data];
   res.render('home.ejs', {gifs:gifs})
});

app.get('/characters', async (req, res) => {
   const topFive = [1, 2, 7, 16, 20];
   const {data} = await plumbus.getCharacter(topFive);
   res.render('characters.ejs', {characters:data})
});

app.get('/locations', async (req, res) => {
   let nameFilter = req.query.name || '';
   let typeFilter = req.query.type || '';
   let params = new URLSearchParams();

   if (!nameFilter && !typeFilter) {
      return res.render('locations.ejs', {locations: [], currentNameFilter: '', currentTypeFilter: ''});
   }

   if (nameFilter) {
      params.append('name', nameFilter);
   } 
   if (typeFilter) {
      params.append('type', typeFilter);
   }

   let url = `https://rickandmortyapi.com/api/location?${params.toString()}`;
   let response = await fetch(url);
   let data = await response.json();
   res.render('locations.ejs', {locations: data.results || [], currentNameFilter: nameFilter, currentTypeFilter: typeFilter})
});

app.get('/episodes', async (req, res) => {
   const topFive = [28, 22, 15, 24, 21];
   const {data} = await plumbus.getEpisode(topFive);
   res.render('episodes.ejs', {episodes:data})
});

app.listen(3000, () => {
    console.log('server started');
});