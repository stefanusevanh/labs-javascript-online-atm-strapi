"use strict";

/**
 * account controller
 */
const bcrypt = require("bcrypt");

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::account.account", ({ strapi }) => ({
  login: async (ctx) => {
    const { pin, username } = ctx.request.body.data;

    const entries = await strapi.db.query("api::account.account").findOne({
      where: {
        username: username,
      },
    });

    const istrue = await comparePasswords(pin, entries.pin);

    if (!istrue) {
      return ctx.badRequest("Account not found", { data: null });
    }
    ctx.body = entries;
  },
}));
