# inverted_indexing_nlp

Author:  Susan Imrie

Developed in Node.js v8.1.1.

## Description

This crawls the web site of whatever URL is entered, indexing the words on that page and and on the linked pages down two levels.

The words are stemmed and the reverse index uses the stem to look up the URLs of the pages where the words associated with the stem were found.

The search returns the list of URLs for each stem of the search terms entered.

The title of the linked URLs is displayed.

Repeats are possible because the complete URLs are stored and sometimes include extraneous query terms.

## Installation

    git clone https://github.com/simrie/inverted_indexing_nlp.git
    
    npm install
    
    npm start


### When the server starts...

The Node.js application will start an Express server with Socket.io, and should automatically launch a browser window that contains a page with an Angular.js app and Bootstrap styling.

If it does not open automatically, it should be available at "localhost:3001".

Search relevance has not been implemented at as of this writing.
 
## Wink Natural Language Processing Library

This indexes words based on the "stem" determined by the Wink library.

This should means that searching on "history", "historical" or "histories" would all get the results indexed for the stem "histori" but the actual results are not as expected.

## Future Development

Future development could include ranking search results by relevance using the Wink library's proximity match and measuring functions.

