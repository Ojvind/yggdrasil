import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';

export const signIn = async variables =>
  await axios.post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables,
  });

export const me = async token =>
  await axios.post(
    API_URL,
    {
      query: `
        {
          me {
            id
            email
            username
          }
        }
      `,
    },
    token
      ? {
        headers: {
          'x-token': token,
        },
      }
      : null,
  );

export const user = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables,
  });

export const users = async () =>
  axios.post(API_URL, {
    query: `
      {
        users {
          id
          username
          email
          role
        }
      }
    `,
  });

export const signUp = async variables =>
  axios.post(API_URL, {
    query: `
      mutation(
        $username: String!,
        $email: String!,
        $password: String!
      ) {
        signUp(
          username: $username,
          email: $email,
          password: $password
        ) {
          token
        }
      }
    `,
    variables,
  });

export const updateUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($username: String!) {
          updateUser(username: $username) {
            username
          }
        }
      `,
      variables,
    },
    token
      ? {
        headers: {
          'x-token': token,
        },
      }
      : null,
  );

export const deleteUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables,
    },
    token
      ? {
        headers: {
          'x-token': token,
        },
      }
      : null,
  );

export const messages = async () =>
  axios.post(API_URL, {
    query: `
  query {
    messages (limit: 2) {
        edges {
          text
        }
      }
    }
  `,
  });

export const messagesInclUsers = async () =>
  axios.post(API_URL, {
    query: `
  query {
    messages (limit: 2) {
        edges {
          text
          user {
            username
          }
        }
      }
    }
  `,
  });

export const writer = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        writer(id: $id) {
          id
          name
          surname
          homepage
          nationality
        }
      }
    `,
    variables,
  });

export const writers = async () =>
  axios.post(API_URL, {
    query: `
      {
        writers {
          edges {
            id
            name
            surname
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  });

export const createWriter = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($name: String!, $surname: String!, $homepage: String, $nationality: String) {
        createWriter(name: $name, surname: $surname, homepage: $homepage, nationality: $nationality) {
          id
          name
          surname
          homepage
          nationality
        }
      }
    `,
    variables,
  });

export const updateWriter = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($id: ID!, $name: String!, $surname: String!, $homepage: String, $nationality: String) {
        updateWriter(id: $id, name: $name, surname: $surname, homepage: $homepage, nationality: $nationality) {
          id
          name
          surname
          homepage
          nationality
        }
      }
    `,
    variables,
  });

export const deleteWriter = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($id: ID!) {
        deleteWriter(id: $id)
      }
    `,
    variables,
  });

export const book = async variables =>
  axios.post(API_URL, {
    query: `
      query ($bookId: ID!) {
        book(bookId: $bookId) {
          id
          title
          yearRead
          yearPublished
        }
      }
    `,
    variables,
  });

export const allBooks = async () =>
  axios.post(API_URL, {
    query: `
      {
        allBooks {
          edges {
            id
            title
            yearRead
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  });

export const books = async variables =>
  axios.post(API_URL, {
    query: `
      query ($writerId: ID) {
        books(writerId: $writerId) {
          edges {
            id
            title
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables,
  });

export const createBook = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($writerId: ID!, $title: String!, $yearRead: String!, $yearPublished: String, $url: String, $description: String) {
        createBook(writerId: $writerId, title: $title, yearRead: $yearRead, yearPublished: $yearPublished, url: $url, description: $description) {
          id
          title
          yearRead
          yearPublished
        }
      }
    `,
    variables,
  });

export const updateBook = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($id: ID!, $title: String!, $yearRead: String!) {
        updateBook(id: $id, title: $title, yearRead: $yearRead) {
          id
          title
          yearRead
        }
      }
    `,
    variables,
  });

export const deleteBook = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($id: ID!) {
        deleteBook(id: $id)
      }
    `,
    variables,
  });
