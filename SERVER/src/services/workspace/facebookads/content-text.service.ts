import {
  CreateContentTextRequestBody,
  UpdateContentTextRequestBody,
  GetAllContentTextsQuery
} from '~/interfaces/workspace/facebookads/content-text.interface'
import contentTextRepository from '~/repository/workspace/facebookads/content-text.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { CONTENT_TEXT_MESSAGES } from '~/constants/messages/workspace/facebookads/content-text.messages'

class ContentTextService {
  private async checkContentTextExists(contentTextId: string) {
    const contentText = await contentTextRepository.getContentTextById(contentTextId)
    if (!contentText) {
      throw new ErrorWithStatusCode({
        message: CONTENT_TEXT_MESSAGES.CONTENT_TEXT_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return contentText
  }

  private async checkContentTextContentExists(content: string) {
    const existingContentText = await contentTextRepository.checkContentTextByContent(content)
    if (existingContentText) {
      throw new ErrorWithStatusCode({
        message: CONTENT_TEXT_MESSAGES.CONTENT_TEXT_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BadRequest
      })
    }
  }

  async createContentText(contentTextData: CreateContentTextRequestBody) {
    // await this.checkContentTextContentExists(contentTextData.content)
    return await contentTextRepository.createContentText(contentTextData)
  }

  async getAllContentTexts(query: GetAllContentTextsQuery) {
    return await contentTextRepository.getAllContentTexts(query)
  }

  async getContentTextById(contentTextId: string) {
    return await this.checkContentTextExists(contentTextId)
  }

  async updateContentText(contentTextId: string, updateData: UpdateContentTextRequestBody) {
    await this.checkContentTextExists(contentTextId)

    if (updateData.content) {
      const existingContentText = await contentTextRepository.checkContentTextByContent(updateData.content)
      if (existingContentText && existingContentText._id.toString() !== contentTextId) {
        throw new ErrorWithStatusCode({
          message: CONTENT_TEXT_MESSAGES.CONTENT_TEXT_ALREADY_EXISTS,
          statusCode: HttpStatusCode.BadRequest
        })
      }
    }

    return await contentTextRepository.updateContentText(contentTextId, updateData)
  }

  async deleteContentText(contentTextId: string) {
    await this.checkContentTextExists(contentTextId)
    return await contentTextRepository.deleteContentText(contentTextId)
  }
}

const contentTextService = new ContentTextService()
export default contentTextService
