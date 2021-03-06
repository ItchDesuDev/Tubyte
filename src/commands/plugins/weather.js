'use strict';

const app = require('../../settings/app');

app.bot.onText(/^\/clima (.+)/, function(msg, match){
app.bot.removeListener('callback_query')
    const prop = {
        'chat_id': msg.chat.id,
        'city': match[1],
        'TypeTemp': 'C',
        'lang': 'ES'
    };

    app.weather.find({search: prop.city , degreeType: prop.TypeTemp, lang: prop.lang}, function(err, result){
        if (err) console.log(err);
        console.log(result);

        const opts = {
            'localizacion': '',
            'latitud': '',
            'longitud': '',
            'temperatura': '',
            'sensaciontermica': '',
            'humedad': '',
            'direccion_viento': '',
            'img_day': '',
            'forecast': ''
        };

        for (var i = 0; i < result.length; i++){
            opts.localizacion = result[i].location.name;
            opts.latitud = result[i].location.lat;
            opts.longitud = result[i].location.long;
            opts.temperatura = result[i].current.temperature + "ΒΊC, " + result[i].current.skytext;
            opts.sensaciontermica = result[i].current.feelslike;
            opts.humedad = result[i].current.humidity;
            opts.direccion_viento = result[i].current.winddisplay;
            opts.img_day = result[i].current.imageUrl;
            opts.forecast = result[i].forecast;
        }


        const button = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[{text: app.i18n.__('See the week'), callback_data: 'week'}]]
            }
        }
        var text = app.i18n.__('π *Day and hour:* ') + app.moment().format('LLL') + "\n[" + "π" + "]" + "(" + opts.img_day + ")" + app.i18n.__(' *Location:* ') + opts.localizacion + app.i18n.__('\n\nπ *Latitude:* ') + opts.latitud + app.i18n.__(' *Longitude:* ') + opts.longitud + app.i18n.__('\nπ‘ *Temperature:* ') + opts.temperatura + app.i18n.__('\nβοΈ *Thermal sensation:* ') + opts.sensaciontermica + app.i18n.__('\nπ« *Humidity*: ') + opts.humedad + app.i18n.__('\nπ *Direction of the wind:* ') + opts.direccion_viento;

        app.bot.sendMessage(prop.chat_id, text, button);


        app.bot.on('callback_query', function onCallbackQuery(forecastWeek){
            const data = forecastWeek.data;
            const msg = forecastWeek.message;
            var forecast = opts.forecast;

            const proper = {
                parse_mode: 'Markdown',
                chat_id: msg.chat.id,
                message_id: msg.message_id
            }

            if (data == 'week'){

                var forecastReport = "";

                for (var o = 2; o < forecast.length; o++){
                    forecastReport += app.i18n.__('π *Forecast Day:* ') + forecast[o].date + ", " + forecast[o].day + app.i18n.__('\nπ*Minimum temperature:* ') + forecast[o].low + "ΒΊC" + app.i18n.__('\n*πMaximum temperature:* ') + forecast[o].high + "ΒΊC" + app.i18n.__('\n*β­οΈ Situation:* ') + forecast[o].skytextday + app.i18n.__('\n*π§ Precipitation:* ') + forecast[o].precip + "%" + "\n\n";
                }
                app.bot.sendMessage(prop.chat_id, app.i18n.__('π *Location:* ') + opts.localizacion + "\n\n" + forecastReport, proper);

            }

        })

    })

});
