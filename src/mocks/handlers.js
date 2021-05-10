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
]