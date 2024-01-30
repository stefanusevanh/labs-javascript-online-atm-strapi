module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/balance/:documentId",
      handler: "transaction.balance",
    },
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/mutation/:documentId",
      handler: "transaction.mutation",
    },
  ],
};
