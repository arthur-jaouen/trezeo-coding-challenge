import fsReverse from 'fs-reverse';
import { Transform } from 'stream';
import { StringDecoder } from 'string_decoder';

const decoder = new StringDecoder('utf8');
const reWords = /[^\w]+/;

const wordsTranform = new Transform({
    transform(chunk, encoding, cb) {
        const words = decoder.write(chunk).split(reWords);

        words.forEach(word => {
            if (word.length > 0) {
                this.push(word);
            }
        });

        cb();
    }
});

const wordsFound = {};
let lastWord = null;

fsReverse(process.argv[2])
    .pipe(wordsTranform)
    .on('data', word => {
        const strWord = word.toString().toLowerCase();
        if (wordsFound[strWord] !== true) {
            wordsFound[strWord] = true;
            lastWord = word;
        }
    })
    .on('end', () => {
        console.log(lastWord.toString());
    });
