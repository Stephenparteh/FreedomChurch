import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const galleryItemSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 150 },
    imageUrl: { type: String, required: true, trim: true },
    altText: { type: String, required: true, trim: true, maxlength: 200 },
    caption: { type: String, trim: true, maxlength: 300 },
    category: { type: String, trim: true, maxlength: 60, index: true },
    displayOrder: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

applyJsonTransform(galleryItemSchema)

export type GalleryItem = InferSchemaType<typeof galleryItemSchema>
export const GalleryItemModel = model('GalleryItem', galleryItemSchema)
