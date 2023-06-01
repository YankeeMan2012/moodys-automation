const lodash = require('lodash');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const fromPage = async (api, ticker) => {
  const page = await api.get('/search', {params: {keyword: ticker}});
  const DOM = new JSDOM(page.data);
  const script = DOM.window.document.querySelector('.search-result-widget--widget script')?.textContent;
  const info = JSON.parse(script);
  return {
    ticker: ticker,
    longTermDeposit: lodash.get(info, 'store.orgKnowledgeBox.ratings.data.longTermDeposit.rating.value'),
    longTermRating: lodash.get(info, 'store.orgKnowledgeBox.ratings.data.longTermRating.rating.value'),
    shortTermRating: lodash.get(info, 'store.orgKnowledgeBox.ratings.data.shortTermRating.rating.value'),
    outlook: lodash.get(info, 'store.orgKnowledgeBox.ratings.data.outlook.rating.value'),
  };
}

const fromSearch = async (api, ticker) => {
  const resp = await api.post('/services/mdc-search', {
    data: [{
      keyword: ticker,
      originalKeyword: ticker,
      language: 'en'
    }, 'organizations'],
  }, {
    params: {
      name: 'getSearchResult',
    }
  });

  const statByKey = (key) => lodash.get(resp, `data.data.orgKnowledgeBox.ratings.data.${key}.rating.value`);

  return {
    ticker: ticker,
    corp: lodash.get(resp, 'data.data.orgKnowledgeBox.orgName'),
    LtCounterpartyRiskRating: statByKey('LtCounterpartyRiskRating'),
    StCounterpartyRiskRating: statByKey('StCounterpartyRiskRating'),
    baselineCreditAssessment: statByKey('baselineCreditAssessment'),
    longTermDeposit: statByKey('longTermDeposit'),
    longTermRating: statByKey('longTermRating'),
    longTermDebt: statByKey('longTermDebt'),
    shortTermRating: statByKey('shortTermRating'),
    outlook: statByKey('outlook'),
  };
};

module.exports = {
  fromPage,
  fromSearch,
};
