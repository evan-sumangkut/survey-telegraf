/*-------------------------------
Membuat bot Telegram sederhana
dengan Telegraf Framework ~ NodeJS
--------------------------------*/

const Telegraf = require('telegraf')
//  const bot = new Telegraf('988079564:AAHmYl-MA2kJeezuWmlDqekexV1AD0XNQJU') // gteksat
// const bot = new Telegraf('1167119928:AAHyzCp8IwW77NKomfBjMM2FKSmFYeEdflQ') // evan_bot // Dev
const bot = new Telegraf('1394209254:AAE7K1GGOfpENP4PiOT4rwU-UxP8osyP1Wo') // FKMUI

const axios = require('axios');

const base_url = 'http://localhost:8080/survey?branch=1&via=telegram&'

bot.on('text', async (ctx) => {

  try{
    const res = await getSurvey(ctx.message);

    console.log(res)
    let question = res.data.question
    let respond = ''
    if(res.type=='survey'){
      let choice = res.data.choice ? res.data.choice.split("~") : null;
      let choice_description = res.data.choice_description ? res.data.choice_description.split("~") : null;

      if(choice){
        for (i = 0; i < choice.length; i++) {
          respond += choice[i] + "."+choice_description[i]+"\n";
        }
      }
    }
    let msg = question+'\n'+respond
    if(res.status=='success'){
      if(res.path=='finish'){
        ctx.replyWithMarkdown(res.message)
        return
      }
    }else{
      ctx.replyWithMarkdown(res.message)
    }
    ctx.replyWithMarkdown(msg)

  }catch(error){
    ctx.reply('error...')
  }

}).catch(function(error) {
  console.log('---------------INFO ERROR 1------------');
  // console.log(error);
  if (error.response && error.response.statusCode === 403) {
    console.log('---------------INFO ERROR 2------------');
    // console.log(error);
  }
});

async function getSurvey(ctx) {
  try {
    let url = base_url+'username='+ctx.from.id+'&respond='+ctx.text+''
    const response = await axios.get(url);
    if(response.data){
      return response.data
    }
    return 'error.'
  } catch (error) {
    // console.log(error);
    return 'error..'
  }
}

bot.startPolling()
