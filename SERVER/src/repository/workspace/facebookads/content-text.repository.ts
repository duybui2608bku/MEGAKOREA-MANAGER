import ContentText from '~/models/workspace/facebookads/resource/content-ads'
import {
  CreateContentTextRequestBody,
  UpdateContentTextRequestBody,
  GetAllContentTextsQuery
} from '~/interfaces/workspace/facebookads/content-text.interface'
import { generatePagination } from '~/utils/pagination/pagination.util'
import { buildDateFilter, buildSearchFilter, combineFilters } from '~/utils/util/query-builder'

class ContentTextRepository {
  private async getTotalContentTextsCount(filter: any) {
    return await ContentText.countDocuments(filter)
  }

  async createContentText(contentTextData: CreateContentTextRequestBody) {
    const contentText = new ContentText(contentTextData)
    return await contentText.save()
  }

  async checkContentTextByContent(content: string) {
    return await ContentText.findOne({ content })
  }

  async getAllContentTexts(query: GetAllContentTextsQuery) {
    const { current, pageSize, search, category, branch, services, start_date, end_date } = query

    const { skip, limit, page } = generatePagination(current, pageSize)

    const searchFilter = buildSearchFilter(
      { content: search, category, branch, services },
      { decode: ['content', 'category', 'branch', 'services'] }
    )

    const dateFilter = buildDateFilter('created_at', start_date, end_date)

    const filter = combineFilters(searchFilter, dateFilter)

    const [list, total] = await Promise.all([
      ContentText.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      this.getTotalContentTextsCount(filter)
    ])

    return {
      list,
      total,
      current: page
    }
  }

  async getContentTextById(contentTextId: string) {
    return await ContentText.findById(contentTextId)
  }

  async updateContentText(contentTextId: string, updateData: UpdateContentTextRequestBody) {
    return await ContentText.findByIdAndUpdate(contentTextId, { ...updateData, updated_at: new Date() }, { new: true })
  }

  async deleteContentText(contentTextId: string) {
    return await ContentText.findByIdAndDelete(contentTextId)
  }
}

const contentTextRepository = new ContentTextRepository()
export default contentTextRepository

