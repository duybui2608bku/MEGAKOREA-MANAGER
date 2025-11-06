import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PAGE_MESSAGES } from '~/constants/messages/workspace/facebookads/page.messages'
import {
  CreatePostRequestBody,
  UpdatePostRequestBody,
  GetAllPostsQuery
} from '~/interfaces/workspace/facebookads/page.interface'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import pageService from '~/services/workspace/facebookads/page.service'

export const createPostController = async (
  req: Request<ParamsDictionary, any, CreatePostRequestBody>,
  res: Response
) => {
  const result = await pageService.createPost(req.body)
  ResponseSuccess({
    message: PAGE_MESSAGES.CREATE_POST_SUCCESS,
    res,
    result
  })
}

export const getAllPostsController = async (req: Request, res: Response) => {
  const query = req.query as GetAllPostsQuery
  const result = await pageService.getAllPosts(query)
  ResponseSuccess({
    message: PAGE_MESSAGES.GET_POSTS_SUCCESS,
    res,
    result
  })
}

export const getPostByIdController = async (req: Request, res: Response) => {
  const result = await pageService.getPostById(req.params.id)
  ResponseSuccess({
    message: PAGE_MESSAGES.GET_POST_DETAIL_SUCCESS,
    res,
    result
  })
}

export const updatePostController = async (
  req: Request<ParamsDictionary, any, UpdatePostRequestBody>,
  res: Response
) => {
  const result = await pageService.updatePost(req.params.id, req.body)
  ResponseSuccess({
    message: PAGE_MESSAGES.UPDATE_POST_SUCCESS,
    res,
    result
  })
}

export const deletePostController = async (req: Request, res: Response) => {
  await pageService.deletePost(req.params.id)
  ResponseSuccess({
    message: PAGE_MESSAGES.DELETE_POST_SUCCESS,
    res
  })
}
