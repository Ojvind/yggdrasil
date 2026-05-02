// Kör med:
// docker exec -i yggdrasil-mongo-1 mongosh writer-prod \
//   -u yggdrasil-admin -p DITT_LÖSENORD --authenticationDatabase admin \
//   < mongo/seed-books.js

const data = [
  // 2021
  { title: 'Silvervägen',                                       yearRead: '2021', name: 'Stina',        surname: 'Jackson' },
  { title: 'Ek',                                                yearRead: '2021', name: 'Frida',        surname: 'Andersson Johansson' },
  { title: 'Hemmet',                                            yearRead: '2021', name: 'Mats',         surname: 'Strandberg' },

  // 2022
  { title: 'Kastanjemannen',                                    yearRead: '2022', name: 'Søren',        surname: 'Sveistrup' },
  { title: 'En familjetragedi',                                 yearRead: '2022', name: 'Mattias',      surname: 'Edvardsson' },
  { title: 'Runor: historia, tydning, tolkning',                yearRead: '2022', name: 'Lars Magnar',  surname: 'Enoksen' },
  { title: 'Döden går på visning',                              yearRead: '2022', name: 'Anders',       surname: 'de la Motte' },
  { title: 'Ingen kvinnas land',                                yearRead: '2022', name: 'Katerina',     surname: 'Janouch' },
  { title: 'Benvittring',                                       yearRead: '2022', name: 'Johan',        surname: 'Theorin' },
  { title: 'Konferensen',                                       yearRead: '2022', name: 'Mats',         surname: 'Strandberg' },
  { title: 'Dränkt',                                            yearRead: '2022', name: 'Frida',        surname: 'Andersson Johansson' },
  { title: 'Energikoderna',                                     yearRead: '2022', name: 'Sue',          surname: 'Morter' },
  { title: 'The 5 Languages of Appreciation in the Workplace', yearRead: '2022', name: 'Gary D',       surname: 'Chapman' },
  { title: 'Rotvälta',                                          yearRead: '2022', name: 'Tove',         surname: 'Alsterdal' },

  // 2023
  { title: 'Slukhål',                                          yearRead: '2023', name: 'Tove',         surname: 'Alsterdal' },
  { title: 'Lönsamt ledarskap',                                yearRead: '2023', name: 'Hans',         surname: 'Blank',         url: 'https://mercuri.se/insights/lonsamt-ledarskap/' },
  { title: 'Senare',                                           yearRead: '2023', name: 'Stephen',      surname: 'King' },
  { title: 'Rovhjärta',                                        yearRead: '2023', name: 'Ulrika',       surname: 'Rolfsdotter' },
  { title: 'Runor: mästarens handbok',                         yearRead: '2023', name: 'Lars Magnar',  surname: 'Enoksen' },
  { title: 'Spindeln',                                         yearRead: '2023', name: 'Lars',         surname: 'Kepler' },
  { title: 'Syndabarn',                                        yearRead: '2023', name: 'Ulrika',       surname: 'Rolfsdotter' },
  { title: 'Lova mig tystnad',                                 yearRead: '2023', name: 'Mattias',      surname: 'Edvardsson' },
  { title: 'Djur och natur i fornnordisk mytologi',            yearRead: '2023', name: 'Lars Magnar',  surname: 'Enoksen' },
  { title: 'Glaskroppar: Svart melankoli',                     yearRead: '2023', name: 'Erik Axl',     surname: 'Sund' },
  { title: 'Skriften i vattnet',                               yearRead: '2023', name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Dockliv: Grå melankoli',                           yearRead: '2023', name: 'Erik Axl',     surname: 'Sund' },
  { title: 'Otid: Vit melankoli',                              yearRead: '2023', name: 'Erik Axl',     surname: 'Sund' },

  // 2024
  { title: 'Assistenten',                                      yearRead: '2024', name: 'S.K.',         surname: 'Tremayne' },
  { title: 'Accelerate',                                       yearRead: '2024', name: 'Nicole',       surname: 'Forsgren' },
  { title: 'Rummet i jorden',                                  yearRead: '2024', name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Ödet och hoppet',                                  yearRead: '2024', name: 'Niklas',       surname: 'Natt och Dag' },
  { title: 'Jag kommer att hitta nyckeln',                     yearRead: '2024', name: 'Alex',         surname: 'Ahndoril' },
  { title: 'Handbok i livets konst',                           yearRead: '2024', name: 'Epiktetos',    surname: 'Epiktetos' },
  { title: 'Snorres edda & den poetiska eddan',                yearRead: '2024', name: 'Snorre',       surname: 'Sturlason' },
  { title: 'Buffésex',                                         yearRead: '2024', name: 'Marika',       surname: 'Smith' },
  { title: 'Verkligheten',                                     yearRead: '2024', name: 'John Ajvide',  surname: 'Lindqvist' },
  { title: 'Speciella omständigheter',                         yearRead: '2024', name: 'John Ajvide',  surname: 'Lindqvist' },
];

let writersCreated = 0;
let booksCreated = 0;
let skipped = 0;

for (const { title, name, surname, url, yearRead } of data) {
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
    const book = { title, writerId: writer._id, yearRead, createdAt: new Date(), updatedAt: new Date() };
    if (url) book.url = url;
    db.books.insertOne(book);
    print(`  Ny bok: ${title}`);
    booksCreated++;
  }
}

print('');
print(`Klart! ${writersCreated} nya författare, ${booksCreated} nya böcker, ${skipped} hoppades över.`);
