const seed = async models => {
  const date = new Date();
  const nextDate = () => new Date(date.setSeconds(date.getSeconds() + 1));

  await new models.User({ username: 'öje', email: 'ojvind.otterbjork@icloud.com', password: 'öje', role: 'ADMIN' }).save();
  await new models.User({ username: 'user2', email: 'user2@user.se', password: 'user2' }).save();

  const writersData = [
    {
      name: 'Tim', surname: 'Ferriss', homepage: 'https://tim.blog/', nationality: 'US',
      books: [
        { title: 'The 4-Hour Workweek', url: 'https://fourhourworkweek.com/', yearPublished: '2007', yearRead: '2016' },
        { title: 'The 4-Hour Body', url: 'https://fourhourbody.com/', yearPublished: '2010', yearRead: '2017' },
        { title: 'The 4-Hour Chef', url: 'https://tim.blog/4hc/', yearPublished: '2012', yearRead: '2018' },
        { title: 'Tools of Titans', url: 'https://tim.blog/tot/', yearPublished: '2016', yearRead: '2017' },
        { title: 'Tribe of Mentors', url: 'https://tim.blog/tom/', yearPublished: '2017', yearRead: '2019' },
        { title: 'Smarter, Faster, Better', url: 'https://tim.blog/', yearPublished: '2019', yearRead: '2020' },
      ],
    },
    {
      name: 'Greg', surname: 'McKeown', homepage: 'https://gregmckeown.com/', nationality: 'GB',
      books: [
        { title: 'Essentialism', url: 'https://gregmckeown.com/books/essentialism/', yearPublished: '2014', yearRead: '2019' },
        { title: 'Effortless', url: 'https://gregmckeown.com/books/effortless/', yearPublished: '2021', yearRead: '2022' },
        { title: 'The Disciplined Pursuit', url: 'https://gregmckeown.com/', yearPublished: '2016', yearRead: '2020' },
        { title: 'Less, But Better', url: 'https://gregmckeown.com/', yearPublished: '2018', yearRead: '2021' },
        { title: 'One Priority', url: 'https://gregmckeown.com/', yearPublished: '2023', yearRead: '2024' },
      ],
    },
    {
      name: 'Lars', surname: 'Kepler', homepage: 'http://larskepler.com/', nationality: 'SE',
      books: [
        { title: 'Hypnotisören', url: 'https://larskepler.com/', yearPublished: '2009', yearRead: '2015' },
        { title: 'Paganinikontraktet', url: 'https://larskepler.com/', yearPublished: '2010', yearRead: '2016' },
        { title: 'Eldvittnet', url: 'https://larskepler.com/', yearPublished: '2011', yearRead: '2017' },
        { title: 'Sandmannen', url: 'https://larskepler.com/', yearPublished: '2012', yearRead: '2018' },
        { title: 'Stalker', url: 'https://larskepler.com/', yearPublished: '2014', yearRead: '2018' },
        { title: 'Kaninjägaren', url: 'https://larskepler.com/', yearPublished: '2016', yearRead: '2019' },
        { title: 'Lazarus', url: 'https://larskepler.com/books/lazarus/', yearPublished: '2019', yearRead: '2020' },
        { title: 'Spegelmannen', url: 'https://larskepler.com/', yearPublished: '2021', yearRead: '2022' },
        { title: 'Klara', url: 'https://larskepler.com/', yearPublished: '2023', yearRead: '2023' },
        { title: 'Skuggbruden', url: 'https://larskepler.com/', yearPublished: '2024', yearRead: '2024' },
        { title: 'Nattjägaren', url: 'https://larskepler.com/', yearPublished: '2025', yearRead: '2025' },
        { title: 'Isvargen', url: 'https://larskepler.com/', yearPublished: '2026', yearRead: '2026' },
        { title: 'Dödens vittne', url: 'https://larskepler.com/', yearPublished: '2027', yearRead: '2027' },
        { title: 'Blodmånen', url: 'https://larskepler.com/', yearPublished: '2028', yearRead: '2028' },
      ],
    },
    {
      name: 'Yuval Noah', surname: 'Harari', homepage: 'https://www.ynharari.com/', nationality: 'IL',
      books: [
        { title: 'Sapiens', url: 'https://www.ynharari.com/book/sapiens-2/', yearPublished: '2011', yearRead: '2018' },
        { title: 'Homo Deus', url: 'https://www.ynharari.com/book/homo-deus/', yearPublished: '2015', yearRead: '2019' },
        { title: '21 Lessons for the 21st Century', url: 'https://www.ynharari.com/book/21-lessons/', yearPublished: '2018', yearRead: '2020' },
        { title: 'Unstoppable Us', url: 'https://www.ynharari.com/', yearPublished: '2022', yearRead: '2023' },
        { title: 'Nexus', url: 'https://www.ynharari.com/', yearPublished: '2024', yearRead: '2024' },
      ],
    },
    {
      name: 'Malcolm', surname: 'Gladwell', homepage: 'https://www.gladwellbooks.com/', nationality: 'CA',
      books: [
        { title: 'The Tipping Point', url: 'https://www.gladwellbooks.com/', yearPublished: '2000', yearRead: '2016' },
        { title: 'Blink', url: 'https://www.gladwellbooks.com/', yearPublished: '2005', yearRead: '2017' },
        { title: 'Outliers', url: 'https://www.gladwellbooks.com/', yearPublished: '2008', yearRead: '2018' },
        { title: 'What the Dog Saw', url: 'https://www.gladwellbooks.com/', yearPublished: '2009', yearRead: '2019' },
        { title: 'David and Goliath', url: 'https://www.gladwellbooks.com/', yearPublished: '2013', yearRead: '2020' },
        { title: 'Talking to Strangers', url: 'https://www.gladwellbooks.com/', yearPublished: '2019', yearRead: '2021' },
        { title: 'The Bomber Mafia', url: 'https://www.gladwellbooks.com/', yearPublished: '2021', yearRead: '2022' },
      ],
    },
    {
      name: 'Nassim Nicholas', surname: 'Taleb', homepage: 'https://www.fooledbyrandomness.com/', nationality: 'LB',
      books: [
        { title: 'Fooled by Randomness', url: 'https://www.fooledbyrandomness.com/', yearPublished: '2001', yearRead: '2017' },
        { title: 'The Black Swan', url: 'https://www.fooledbyrandomness.com/', yearPublished: '2007', yearRead: '2018' },
        { title: 'The Bed of Procrustes', url: 'https://www.fooledbyrandomness.com/', yearPublished: '2010', yearRead: '2019' },
        { title: 'Antifragile', url: 'https://www.fooledbyrandomness.com/', yearPublished: '2012', yearRead: '2020' },
        { title: 'Skin in the Game', url: 'https://www.fooledbyrandomness.com/', yearPublished: '2018', yearRead: '2021' },
        { title: 'Statistical Consequences of Fat Tails', url: 'https://www.fooledbyrandomness.com/', yearPublished: '2020', yearRead: '2022' },
      ],
    },
    {
      name: 'Cal', surname: 'Newport', homepage: 'https://calnewport.com/', nationality: 'US',
      books: [
        { title: 'How to Win at College', url: 'https://calnewport.com/', yearPublished: '2005', yearRead: '2016' },
        { title: "So Good They Can't Ignore You", url: 'https://calnewport.com/', yearPublished: '2012', yearRead: '2017' },
        { title: 'Deep Work', url: 'https://calnewport.com/books/deep-work/', yearPublished: '2016', yearRead: '2018' },
        { title: 'Digital Minimalism', url: 'https://calnewport.com/', yearPublished: '2019', yearRead: '2020' },
        { title: 'A World Without Email', url: 'https://calnewport.com/', yearPublished: '2021', yearRead: '2022' },
        { title: 'Slow Productivity', url: 'https://calnewport.com/', yearPublished: '2024', yearRead: '2024' },
        { title: 'The Focus Manifesto', url: 'https://calnewport.com/', yearPublished: '2023', yearRead: '2023' },
      ],
    },
    {
      name: 'Ryan', surname: 'Holiday', homepage: 'https://ryanholiday.net/', nationality: 'US',
      books: [
        { title: "Trust Me, I'm Lying", url: 'https://ryanholiday.net/', yearPublished: '2012', yearRead: '2017' },
        { title: 'The Obstacle Is the Way', url: 'https://ryanholiday.net/', yearPublished: '2014', yearRead: '2018' },
        { title: 'Ego Is the Enemy', url: 'https://ryanholiday.net/', yearPublished: '2016', yearRead: '2019' },
        { title: 'The Daily Stoic', url: 'https://dailystoic.com/', yearPublished: '2016', yearRead: '2019' },
        { title: 'Perennial Seller', url: 'https://ryanholiday.net/', yearPublished: '2017', yearRead: '2020' },
        { title: 'Stillness Is the Key', url: 'https://ryanholiday.net/', yearPublished: '2019', yearRead: '2021' },
        { title: 'Courage Is Calling', url: 'https://ryanholiday.net/', yearPublished: '2021', yearRead: '2022' },
        { title: 'Discipline Is Destiny', url: 'https://ryanholiday.net/', yearPublished: '2022', yearRead: '2023' },
      ],
    },
    {
      name: 'Mark', surname: 'Manson', homepage: 'https://markmanson.net/', nationality: 'US',
      books: [
        { title: 'Models', url: 'https://markmanson.net/books/models/', yearPublished: '2011', yearRead: '2018' },
        { title: 'The Subtle Art of Not Giving a F*ck', url: 'https://markmanson.net/books/subtle-art/', yearPublished: '2016', yearRead: '2019' },
        { title: 'Everything Is F*cked', url: 'https://markmanson.net/books/everything-is-fucked/', yearPublished: '2019', yearRead: '2020' },
        { title: 'The Uncomfortable Truth', url: 'https://markmanson.net/', yearPublished: '2021', yearRead: '2022' },
        { title: 'Love Is Not Enough', url: 'https://markmanson.net/', yearPublished: '2023', yearRead: '2024' },
      ],
    },
    {
      name: 'James', surname: 'Clear', homepage: 'https://jamesclear.com/', nationality: 'US',
      books: [
        { title: 'Transform Your Habits', url: 'https://jamesclear.com/', yearPublished: '2014', yearRead: '2018' },
        { title: 'The Habit Blueprint', url: 'https://jamesclear.com/', yearPublished: '2015', yearRead: '2019' },
        { title: 'Atomic Habits', url: 'https://jamesclear.com/atomic-habits/', yearPublished: '2018', yearRead: '2020' },
        { title: 'Small Changes, Big Results', url: 'https://jamesclear.com/', yearPublished: '2021', yearRead: '2022' },
        { title: 'The Compound Life', url: 'https://jamesclear.com/', yearPublished: '2023', yearRead: '2024' },
      ],
    },
    {
      name: 'Adam', surname: 'Grant', homepage: 'https://adamgrant.net/', nationality: 'US',
      books: [
        { title: 'Give and Take', url: 'https://adamgrant.net/book/give-and-take/', yearPublished: '2013', yearRead: '2018' },
        { title: 'Originals', url: 'https://adamgrant.net/book/originals/', yearPublished: '2016', yearRead: '2019' },
        { title: 'Option B', url: 'https://adamgrant.net/book/option-b/', yearPublished: '2017', yearRead: '2020' },
        { title: 'Think Again', url: 'https://adamgrant.net/book/think-again/', yearPublished: '2021', yearRead: '2022' },
        { title: 'Hidden Potential', url: 'https://adamgrant.net/', yearPublished: '2023', yearRead: '2024' },
        { title: 'Power Moves', url: 'https://adamgrant.net/', yearPublished: '2019', yearRead: '2021' },
      ],
    },
    {
      name: 'Brené', surname: 'Brown', homepage: 'https://brenebrown.com/', nationality: 'US',
      books: [
        { title: 'The Gifts of Imperfection', url: 'https://brenebrown.com/', yearPublished: '2010', yearRead: '2017' },
        { title: 'Daring Greatly', url: 'https://brenebrown.com/', yearPublished: '2012', yearRead: '2018' },
        { title: 'Rising Strong', url: 'https://brenebrown.com/', yearPublished: '2015', yearRead: '2019' },
        { title: 'Braving the Wilderness', url: 'https://brenebrown.com/', yearPublished: '2017', yearRead: '2020' },
        { title: 'Dare to Lead', url: 'https://brenebrown.com/', yearPublished: '2018', yearRead: '2021' },
        { title: 'Atlas of the Heart', url: 'https://brenebrown.com/', yearPublished: '2021', yearRead: '2022' },
        { title: 'Unlocking Us', url: 'https://brenebrown.com/', yearPublished: '2023', yearRead: '2024' },
      ],
    },
    {
      name: 'Daniel', surname: 'Kahneman', homepage: 'https://kahneman.scholar.princeton.edu/', nationality: 'IL',
      books: [
        { title: 'Attention and Effort', url: 'https://kahneman.scholar.princeton.edu/', yearPublished: '1973', yearRead: '2016' },
        { title: 'Well-Being', url: 'https://kahneman.scholar.princeton.edu/', yearPublished: '1999', yearRead: '2017' },
        { title: 'Judgment Under Uncertainty', url: 'https://kahneman.scholar.princeton.edu/', yearPublished: '1982', yearRead: '2019' },
        { title: 'Thinking, Fast and Slow', url: 'https://kahneman.scholar.princeton.edu/', yearPublished: '2011', yearRead: '2018' },
        { title: 'Noise', url: 'https://kahneman.scholar.princeton.edu/', yearPublished: '2021', yearRead: '2022' },
      ],
    },
    {
      name: 'Jordan', surname: 'Peterson', homepage: 'https://jordanpeterson.com/', nationality: 'CA',
      books: [
        { title: 'Maps of Meaning', url: 'https://jordanpeterson.com/', yearPublished: '1999', yearRead: '2017' },
        { title: '12 Rules for Life', url: 'https://jordanpeterson.com/12-rules-for-life/', yearPublished: '2018', yearRead: '2019' },
        { title: 'Beyond Order', url: 'https://jordanpeterson.com/', yearPublished: '2021', yearRead: '2022' },
        { title: 'We Who Wrestle with God', url: 'https://jordanpeterson.com/', yearPublished: '2024', yearRead: '2024' },
        { title: 'The Meaning of Chaos', url: 'https://jordanpeterson.com/', yearPublished: '2022', yearRead: '2023' },
      ],
    },
    {
      name: 'Steven', surname: 'Pinker', homepage: 'https://stevenpinker.com/', nationality: 'CA',
      books: [
        { title: 'The Language Instinct', url: 'https://stevenpinker.com/', yearPublished: '1994', yearRead: '2016' },
        { title: 'How the Mind Works', url: 'https://stevenpinker.com/', yearPublished: '1997', yearRead: '2017' },
        { title: 'Words and Rules', url: 'https://stevenpinker.com/', yearPublished: '1999', yearRead: '2018' },
        { title: 'The Blank Slate', url: 'https://stevenpinker.com/', yearPublished: '2002', yearRead: '2019' },
        { title: 'The Stuff of Thought', url: 'https://stevenpinker.com/', yearPublished: '2007', yearRead: '2020' },
        { title: 'The Better Angels of Our Nature', url: 'https://stevenpinker.com/', yearPublished: '2011', yearRead: '2021' },
        { title: 'The Sense of Style', url: 'https://stevenpinker.com/', yearPublished: '2014', yearRead: '2022' },
        { title: 'Enlightenment Now', url: 'https://stevenpinker.com/', yearPublished: '2018', yearRead: '2023' },
        { title: 'Rationality', url: 'https://stevenpinker.com/', yearPublished: '2021', yearRead: '2024' },
      ],
    },
  ];

  for (const writerData of writersData) {
    const { books, ...writerFields } = writerData;
    const writer = new models.Writer({ ...writerFields, createdAt: nextDate() });
    await writer.save();
    for (const bookData of books) {
      await new models.Book({ ...bookData, description: '', createdAt: nextDate(), writerIds: [writer.id] }).save();
    }
  }
};

export default seed;
