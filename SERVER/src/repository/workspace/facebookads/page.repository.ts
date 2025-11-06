import PostedOfPage from '~/models/workspace/facebookads/tools/page/posted_of_page'
import {
  CreatePostRequestBody,
  UpdatePostRequestBody,
  GetAllPostsQuery
} from '~/interfaces/workspace/facebookads/page.interface'
import { generatePagination } from '~/utils/pagination/pagination.util'
import { buildDateFilter, buildSearchFilter, combineFilters } from '~/utils/util/query-builder'

class PageRepository {
  private async getTotalPostsCount(filter: any) {
    return await PostedOfPage.countDocuments(filter)
  }

  async createPost(postData: CreatePostRequestBody) {
    const post = new PostedOfPage({
      ...postData,
      created_at: new Date(),
      updated_at: new Date()
    })
    return await post.save()
  }

  async checkPostByUrl(url: string) {
    return await PostedOfPage.findOne({ url })
  }

  async getAllPosts(query: GetAllPostsQuery) {
    const { current, pageSize, search, page_name, page_id, services, start_date, end_date } = query

    const { skip, limit, page } = generatePagination(current, pageSize)

    const searchFilter = buildSearchFilter(
      { url: search, page_name, page_id, services },
      { decode: ['url', 'page_name', 'services'] }
    )

    const dateFilter = buildDateFilter('created_at', start_date, end_date)

    const filter = combineFilters(searchFilter, dateFilter)

    const [list, total] = await Promise.all([
      PostedOfPage.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      this.getTotalPostsCount(filter)
    ])

    return {
      list,
      total,
      current: page
    }
  }

  async getPostById(postId: string) {
    return await PostedOfPage.findById(postId)
  }

  async updatePost(postId: string, updateData: UpdatePostRequestBody) {
    return await PostedOfPage.findByIdAndUpdate(postId, { ...updateData, updated_at: new Date() }, { new: true })
  }

  async deletePost(postId: string) {
    return await PostedOfPage.findByIdAndDelete(postId)
  }
}

const pageRepository = new PageRepository()
export default pageRepository
