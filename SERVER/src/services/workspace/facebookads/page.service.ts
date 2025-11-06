import {
  CreatePostRequestBody,
  UpdatePostRequestBody,
  GetAllPostsQuery
} from '~/interfaces/workspace/facebookads/page.interface'
import pageRepository from '~/repository/workspace/facebookads/page.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { PAGE_MESSAGES } from '~/constants/messages/workspace/facebookads/page.messages'

class PageService {
  private async checkPostExists(postId: string) {
    const post = await pageRepository.getPostById(postId)
    if (!post) {
      throw new ErrorWithStatusCode({
        message: PAGE_MESSAGES.POST_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return post
  }

  private async checkPostUrlExists(url: string) {
    const existingPost = await pageRepository.checkPostByUrl(url)
    if (existingPost) {
      throw new ErrorWithStatusCode({
        message: PAGE_MESSAGES.POST_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BadRequest
      })
    }
  }

  async createPost(postData: CreatePostRequestBody) {
    await this.checkPostUrlExists(postData.url)
    return await pageRepository.createPost(postData)
  }

  async getAllPosts(query: GetAllPostsQuery) {
    return await pageRepository.getAllPosts(query)
  }

  async getPostById(postId: string) {
    return await this.checkPostExists(postId)
  }

  async updatePost(postId: string, updateData: UpdatePostRequestBody) {
    await this.checkPostExists(postId)

    if (updateData.url) {
      const existingPost = await pageRepository.checkPostByUrl(updateData.url)
      if (existingPost && existingPost._id.toString() !== postId) {
        throw new ErrorWithStatusCode({
          message: PAGE_MESSAGES.POST_ALREADY_EXISTS,
          statusCode: HttpStatusCode.BadRequest
        })
      }
    }

    return await pageRepository.updatePost(postId, updateData)
  }

  async deletePost(postId: string) {
    await this.checkPostExists(postId)
    return await pageRepository.deletePost(postId)
  }
}

const pageService = new PageService()
export default pageService
