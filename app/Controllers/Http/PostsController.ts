// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Post from "App/Models/Post";
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class PostsController {

  //index
  public async index({ response }) {
    const posts = await Post.all()

    return response.ok(posts)
  }

  //store
  public async store({ request, response }) {
    const postSchema = schema.create({
        title: schema.string({ trim: true }, [
            rules.maxLength(255)
        ]),
        content: schema.string({ escape: true }, [
            rules.maxLength(1000)
        ]),
    })

    const payload: any = await request.validate({ schema: postSchema })
    const post: Post = await Post.create(payload)

    return response.ok(post)
  }

  //show
  public async show({ params, response }) {
    const { id } : { id: Number } = params

    const post: any = await Post.find(id)
    if (!post) {
      return response.notFound({message: 'Post Not Found'})
    }

    return response.ok(post)
  }

  //update
  public async update({params, request, response}) {
    const postSchema = schema.create({
      title: schema.string({trim: true}, [
        rules.maxLength(255)
      ]),
      content: schema.string({escape: true}, [
        rules.maxLength(100)
      ])
    })

    const payload: any = await request.validate({ schema: postSchema})
    const {id}: {id: Number} = params
    const post: any = await Post.find(id)
    if (!post) {
      return response.notFound({message: 'Post Not Found'})
    }

    post.title = payload.title
    post.content = payload.content

    await post.save()

    return response.ok(post)
  }

  public async destroy({params, response}) {
    const {id}: {id : Number} = params

    const post:any = await Post.find(id)
    if (!post) {
    return response.notFound({message: "Post Not Found"})
    }

    await post.delete()

    return response.ok({message : "Post deleted successfully."})
  }
}
