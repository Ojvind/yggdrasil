// Kör med:
// docker exec -i yggdrasil-mongo-1 mongosh writer-prod \
//   -u yggdrasil-admin -p DITT_LÖSENORD --authenticationDatabase admin \
//   < mongo/seed-books.js

const data = [
  { title: 'Silvervägen',                                  name: 'Stina',        surname: 'Jackson' },
  { title: 'Ek',                                           name: 'Frida',        surname: 'Andersson Johansson' },
  { title: 'Dränkt',                                       name: 'Frida',        surname: 'Andersson Johansson' },
  { title: 'Hemmet',                                       name: 'Mats',         surname: 'Strandberg' },
  { title: 'Konferensen',                                  name: 'Mats',         surname: 'Strandberg' },
  { title: 'Kastanjemannen',                               name: 'Søren',        surname: 'Sveistrup' },
  { title: 'En familjetragedi',                            name: 'Mattias',      surname: 'Edvardsson' },
  { title: 'Lova mig tystnad',                             name: 'Mattias',      surname: 'Edvardsson' },
  { title: 'Runor: historia, tydning, tolkning',           name: 'Lars Magnar',  surname: 'Enoksen' },
  { title: 'Runor: mästarens handbok',                     name: 'Lars Magnar',  surname: 'Enoksen' },
  { title: 'Djur och natur i fornnordisk mytologi',        name: 'Lars Magnar',  surname: 'Enoksen' },
  { title: 'Döden går på visning',                         name: 'Anders',       surname: 'de la Motte' },
  { title: 'Ingen kvinnas land',                           name: 'Katerina',     surname: 'Janouch' },
  { title: 'Benvittring',                                  name: 'Johan',        surname: 'Theorin' },
  { title: 'Energikoderna',                                name: 'Sue',          surname: 'Morter' },
  { title: 'The 5 Languages of Appreciation in the Workplace', name: 'Gary D',  surname: 'Chapman' },
  { title: 'Rotvälta',                                     name: 'Tove',         surname: 'Alsterdal' },
  { title: 'Slukhål',                                      name: 'Tove',         surname: 'Alsterdal' },
  { title: 'Lönsamt ledarskap',                            name: 'Hans',         surname: 'Blank',          url: 'https://mercuri.se/insights/lonsamt-ledarskap/' },
  { title: 'Senare',                                       name: 'Stephen',      surname: 'King' },
  { title: 'Rovhjärta',                                    name: 'Ulrika',       surname: 'Rolfsdotter' },
  { title: 'Syndabarn',                                    name: 'Ulrika',       surname: 'Rolfsdotter' },
  { title: 'Spindeln',                                     name: 'Lars',         surname: 'Kepler' },
  { title: 'Glaskroppar: Svart melankoli',                 name: 'Erik Axl',     surname: 'Sund' },
  { title: 'Dockliv: Grå melankoli',                       name: 'Erik Axl',     surname: 'Sund' },
  { title: 'Otid: Vit melankoli',                          name: 'Erik Axl',     surname: 'Sund' },
  { title: 'Skriften i vattnet',                           name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Rummet i jorden',                               name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Verkligheten',                                 name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Speciella omständigheter',                     name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Assistenten',                                  name: 'S.K.',         surname: 'Tremayne' },
  { title: 'Accelerate',                                   name: 'Nicole',       surname: 'Forsgren' },
  { title: 'Ödet och hoppet',                              name: 'Niklas',       surname: 'Natt och Dag' },
  { title: 'Jag kommer att hitta nyckeln',                 name: 'Alex',         surname: 'Ahndoril' },
  { title: 'Handbok i livets konst',                       name: 'Epiktetos',    surname: 'Epiktetos' },
  { title: 'Snorres edda & den poetiska eddan',            name: 'Snorre',       surname: 'Sturlason' },
  { title: 'Buffésex',                                     name: 'Marika',       surname: 'Smith' },
];

let writersCreated = 0;
let booksCreated = 0;
let skipped = 0;

for (const { title, name, surname, url } of data) {
  let writer = db.writers.findOne({ name, surname });
  if (!writer) {
    db.writers.insertOne({ name, surname, createdAt: new Date(), updatedAt: new Date() });
    writer = db.writers.findOne({ name, surname });
    writersCreated++;
    print(`  Ny författare: ${name} ${surname}`);
  }

  const existing = db.books.findOne({ title });
  if (existing) {
    print(`  Hoppar över (finns redan): ${title}`);
    skipped++;
  } else {
    const book = { title, writerId: writer._id, yearRead: '2025', createdAt: new Date(), updatedAt: new Date() };
    if (url) book.url = url;
    db.books.insertOne(book);
    print(`  Ny bok: ${title}`);
    booksCreated++;
  }
}

print('');
print(`Klart! ${writersCreated} nya författare, ${booksCreated} nya böcker, ${skipped} hoppades över.`);
