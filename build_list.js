const { writeFileSync } = require('fs');
const { default: { get } } = require('axios');
const file = [];

get('https://cdn.jsdelivr.net/gh/jshttp/mime-db@master/db.json')
    .then(db => {
        return JSON.parse(db);
    })
    .then(list => {
        file.push('module mime\n\nfn load_data() map[string]MimeType {\n    mut data := map[string]MimeType{}\n');

        Object.keys(list).forEach(key => {
            const current = list[key];
            file.push(`    data['${key}'] = MimeType{'${current['source'] || ''}',[${current.hasOwnProperty('extensions') ? current['extensions'].map(s => `'${s}'`).join(', ') : ''}]${!current.hasOwnProperty('extensions') ? 'string': ''},${current['compressible'] || 'false'},'${current['charset'] || ''}'}\n`)
        });

        file.push('    return data\n}');

        writeFileSync(__dirname + '/list.v', file.join(''));
    })
    .catch(err => console.error(err));