const db = {
  users: [
    { id: 1, username: 'testuser@example.com', password: 'testpassword' }
  ]
};

export const findUser = (username) => {
  return db.users.find(user => user.username === username);
}

