import mongoose from 'mongoose'

interface BlogData {
  id: string
  title: string
  content: string
  background: string
  author: string
  date: string
}

const blogDataSchema = new mongoose.Schema<BlogData>({
  title: String,
  author: String,
  background: String,
  content: String,
  id: String,
  date: String, 
})

const BlogModel = mongoose.models.Blogs || mongoose.model('Blogs', blogDataSchema)
export { BlogModel }