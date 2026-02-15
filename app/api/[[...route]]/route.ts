import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

app.post('/create', async (c) => {
  const body = await c.req.json()
  const {title, choices} = body

  console.log(title, choices)

  return c.json({
    data: {title, choices},
    message: 'success'
  }, 201)
})



export const GET = handle(app)
export const POST = handle(app)
