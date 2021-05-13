// importing REST style API requests
import { rest } from 'msw'
import config from '../config'

const id = 1;

export const handlers = [
  // Handles a GET /user request
  rest.get(`${config.API_ENDPOINT}/spells/${id}`, (req, res, ctx) => {
    return res(
      ctx.json({
        date_created: "2021-05-05T16:03:36.726Z",
        date_modified: "2021-05-07T16:51:36.223Z",
        description: "Swirling storm of apples",
        id: 1,
        is_deleted: false,
        is_public: true,
        locked: false,
        name: "kevinaaa Storm (Fork) 2",
        tags: [],
        text: "(displayln \"Hello\")",
        user_id: 5,
      })
    )
  }),
  rest.get(`${config.API_ENDPOINT}/check-ownership/${id}`, (req, res, ctx) => {
    return res(
      ctx.json({
        userOwnsSpell: true,
      })
    )
  }),
  rest.get(`${config.API_ENDPOINT}/public-spells/${id}`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
        author: "dunder",
        date_created: "2021-05-10T20:26:11.971Z",
        date_modified: "2021-05-10T21:10:09.560Z",
        description: "Swirling storm of apples",
        id: 1,
        is_deleted: false,
        is_public: true,
        locked: false,
        name: "Apple Storm",
        tags: [],
        text: "(displayln \"Hello\")",
        user_id: 1,
        },
        {
        author: "dunder",
        date_created: "2021-05-10T20:26:11.971Z",
        date_modified: "2021-05-10T20:26:11.971Z",
        description: "Summons a log cabin",
        id: 2,
        is_deleted: false,
        is_public: true,
        locked: false,
        name: "Cozy Cabin",
        tags: [],
        text: "(displayln \"Hello\")",
        user_id: 1,
        },
        {
        author: "dunder",
        date_created: "2021-05-10T20:26:11.971Z",
        date_modified: "2021-05-10T20:26:11.971Z",
        description: "This spell is set as locked by default",
        id: 6,
        is_deleted: false,
        is_public: true,
        locked: true,
        name: "Safely Locked!",
        tags: [],
        text: "(displayln \"Go Away\")",
        user_id: 1,
        },
      ])
    )

})]