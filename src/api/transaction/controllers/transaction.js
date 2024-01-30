"use strict";

/**
 * transaction controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    balance: async (ctx) => {
      const { documentId } = ctx.request.params;

      const entries = await strapi.db
        .query("api::transaction.transaction")
        .findMany({
          where: {
            account: {
              id: documentId,
            },
          },
          populate: {
            // @ts-ignore
            account: {
              select: ["username"],
            },
          },
        });

      const total = entries?.reduce(
        (val, curval) => val + parseInt(curval.amount),
        0
      );
      ctx.body = { data: { balance: total } };
    },
    mutation: async (ctx) => {
      const { documentId } = ctx.request.params;
      let { sort, filter } = ctx.request.query;
      let where = {
        account: {
          id: documentId,
        },
      };
      if (filter !== "ALL") {
        where = {
          ...where,
          type: filter,
        };
      }

      const entries = await strapi.db
        .query("api::transaction.transaction")
        .findMany({
          where: where,
          populate: {
            // @ts-ignore
            account: {
              select: ["username"],
            },
          },
          orderBy: { createdAt: sort },
        });

      ctx.body = { data: { transactionList: entries } };
    },
    create: async (ctx) => {
      const { amount, userId } = ctx.request.body.data;
      let type = "DEBIT";
      if (amount > 0) {
        type = "CREDIT";
      }

      const balance = await strapi.db
        .query("api::transaction.transaction")
        .findMany({
          where: {
            account: {
              id: userId,
            },
          },
          populate: {
            // @ts-ignore
            account: {
              select: ["username"],
            },
          },
        });

      const balanaceTotal = balance?.reduce(
        (val, curval) => val + parseInt(curval.amount),
        0
      );

      if (balanaceTotal < Math.abs(amount) && type === "DEBIT") {
        return ctx.badRequest("balance is not enough", {
          data: null,
        });
      }

      const isNominal50 = amount % 50000 === 0;
      const isNominal100 = amount % 100000 === 0;

      if (!(isNominal100 || isNominal50)) {
        return ctx.badRequest(
          "minimum amount is nominal or multiplier of nominal",
          {
            data: null,
          }
        );
      }
      if (parseInt(amount) === 0) {
        return ctx.badRequest("amount 0 not allowed", { data: null });
      }
      const entries = await strapi.db
        .query("api::transaction.transaction")
        .create({
          data: {
            type: type,
            amount: amount,
            account: userId,
            publishedAt: new Date(),
          },
        });

      ctx.body = { data: entries };
    },
  })
);
