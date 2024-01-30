module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/login",
      handler: "account.login",
    },
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/register",
      handler: "account.create",
    },
  ],
};
