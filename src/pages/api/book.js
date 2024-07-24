import axios from 'axios';
import xml2js from 'xml2js';

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;

async function normalizePublicationDate(pubDate) {
  if (!pubDate || pubDate === "Not found") {
    return "Not found";
  }

  pubDate = pubDate.trim();

  // Various date format checks and conversions
  // ... (implement the date normalization logic here)

  return "Not found";
}

async function fetchFromRakutenBooks(isbn) {
  try {
    const url = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&isbn=${isbn}&applicationId=${RAKUTEN_APP_ID}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.Items && data.Items.length > 0) {
      const book = data.Items[0].Item;
      console.log(`Rakuten Books: Found information for ISBN ${isbn}`);
      return {
        title: book.title || "Not found",
        author: book.author || "Not found",
        publisher: book.publisherName || "Not found",
        publicationDate: await normalizePublicationDate(book.salesDate),
        coverImage: book.largeImageUrl || "Not found",
        description: book.itemCaption || "Not found",
        pageCount: book.pageCount || "Not found",
        genre: "Not found" // Implement genre mapping if needed
      };
    } else {
      console.log(`Rakuten Books: No items found for ISBN ${isbn}`);
    }
  } catch (error) {
    console.error(`Rakuten Books: Error fetching data for ISBN ${isbn} - ${error.message}`);
  }
  return null;
}

async function fetchFromGoogleBooks(isbn) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.items && data.items.length > 0) {
      const book = data.items[0].volumeInfo;
      console.log(`Google Books: Found information for ISBN ${isbn}`);
      return {
        title: book.title || "Not found",
        author: book.authors ? book.authors.join(", ") : "Not found",
        publisher: book.publisher || "Not found",
        publicationDate: await normalizePublicationDate(book.publishedDate),
        coverImage: book.imageLinks ? book.imageLinks.thumbnail : "Not found",
        description: book.description || "Not found",
        pageCount: book.pageCount || "Not found",
        genre: "Not found"
      };
    } else {
      console.log(`Google Books: No items found for ISBN ${isbn}`);
    }
  } catch (error) {
    console.error(`Google Books: Error fetching data for ISBN ${isbn} - ${error.message}`);
  }
  return null;
}

async function fetchFromNationalDietLibrary(isbn) {
  try {
    const url = `https://iss.ndl.go.jp/api/opensearch?isbn=${isbn}`;
    const response = await axios.get(url);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    if (result.feed && result.feed.entry && result.feed.entry.length > 0) {
      const book = result.feed.entry[0];
      console.log(`NDL: Found information for ISBN ${isbn}`);
      return {
        title: book['dc:title'] ? book['dc:title'][0] : "Not found",
        author: book['dc:creator'] ? book['dc:creator'][0] : "Not found",
        publisher: book['dc:publisher'] ? book['dc:publisher'][0] : "Not found",
        publicationDate: await normalizePublicationDate(book['dc:date'] ? book['dc:date'][0] : "Not found"),
        coverImage: "Not found",
        description: "Not found",
        pageCount: "Not found",
        genre: "Not found"
      };
    } else {
      console.log(`NDL: No items found for ISBN ${isbn}`);
    }
  } catch (error) {
    console.error(`NDL: Error fetching data for ISBN ${isbn} - ${error.message}`);
  }
  return null;
}

export default async function handler(req, res) {
  const { isbn } = req.query;

  if (!isbn) {
    return res.status(400).json({ error: 'ISBN is required' });
  }

  let bookInfo = await fetchFromRakutenBooks(isbn);

  if (!bookInfo) {
    bookInfo = await fetchFromGoogleBooks(isbn);
  }

  if (!bookInfo) {
    bookInfo = await fetchFromNationalDietLibrary(isbn);
  }

  if (!bookInfo) {
    bookInfo = {
      title: "Not found",
      author: "Not found",
      publisher: "Not found",
      publicationDate: "Not found",
      coverImage: "Not found",
      description: "Not found",
      pageCount: "Not found",
      genre: "Not found"
    };
  }

  bookInfo.isbn = isbn;

  res.status(200).json(bookInfo);
}