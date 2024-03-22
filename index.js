/**
 * Note: My test account did not have access to Custom Objects, so I followed your documentation and used Company object instead.
 * Link: https://app-eu1.hubspot.com/academy/144354397/tracks/1092124/1093824/5493?language=en
 */

/** Load ENV variables */
require('dotenv').config();

/** Import node modules */
const express = require('express');
const axios = require('axios');
const app = express();

/** App settings*/
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Load Private App Access Token from .env */
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

/** Show existing companies */
app.get('/', async (req, res) => {
    const companies = 'https://api.hubspot.com/crm/v3/objects/companies?properties=name,cvr_number,pot_number';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(companies, { headers });
        const data = resp.data.results;
        res.render('companies', { title: 'All companies', data });      
    } catch (error) {
        console.error(error);
    }
});

/** Create new company */
app.get('/create-cobj', async (req, res) => {
    res.render('create', { title: 'Create new company'});
});

/** Store new company */
app.post('/create-cobj', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.name,
            "pot_number": req.body.pot,
            "cvr_number": req.body.cvr
        }
    }
    const companies = 'https://api.hubspot.com/crm/v3/objects/companies';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.post(companies, update, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

/** Delete existing company */
app.post('/delete-cobj/:id', async (req, res) => {
    const companyId = parseInt(req.params.id);
    const companies = 'https://api.hubspot.com/crm/v3/objects/companies/' + companyId;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.delete(companies, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

/** Open existing company */
app.get('/open-cobj/:id', async (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = 'https://api.hubspot.com/crm/v3/objects/companies/' + companyId + "?properties=name,pot_number,cvr_number"
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(company, { headers });
        const data = resp.data;
        res.render('edit', { title: 'Edit company', data});      
    } catch (error) {
        console.error(error);
    }
});

/** Update existing company */
app.post('/update-cobj/:id', async (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = 'https://api.hubspot.com/crm/v3/objects/companies/' + companyId
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    const update = {
        properties: {
            "name": req.body.name,
            "pot_number": req.body.pot,
            "cvr_number": req.body.cvr
        }
    }
    try {
        const resp = await axios.patch(company, update, { headers });
        const data = resp.data;
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

/** Start the app */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));