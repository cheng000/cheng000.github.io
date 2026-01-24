<template>
  <div class="cat-pic-manager">
    <!-- 上传面板 -->
    <div class="upload-panel" :class="{ show: showUploadPanel }">
      <div class="panel-header">
        <h3>上传猫咪照片</h3>
        <button class="close-btn" @click="toggleUploadPanel">×</button>
      </div>

      <div class="panel-content">
        <!-- 文件选择区域 -->
        <div
          class="upload-area"
          :class="{ 'drag-over': isDragOver }"
          @dragenter.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="$refs.fileInput.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileSelect"
            style="display: none"
          />
          <div class="upload-icon">📸</div>
          <p class="upload-hint">点击或拖拽图片到此处</p>
          <p class="upload-sub-hint">支持 JPG、PNG、GIF 格式</p>
        </div>

        <!-- 宠物选择 -->
        <div class="form-group">
          <label>选择宠物</label>
          <select v-model="selectedPetName" class="pet-select">
            <option value="">全部宠物</option>
            <option value="菠萝包">菠萝包</option>
            <option value="咪咪">咪咪</option>
          </select>
        </div>

        <!-- 图片描述 -->
        <div class="form-group">
          <label>图片描述（可选）</label>
          <textarea
            v-model="imageDescription"
            placeholder="添加描述..."
            rows="2"
          ></textarea>
        </div>

        <!-- 已选文件列表 -->
        <div v-if="selectedFiles.length > 0" class="selected-files">
          <div class="files-header">
            <span>已选择 {{ selectedFiles.length }} 个文件</span>
            <button class="clear-btn" @click="clearSelection">清空</button>
          </div>
          <div class="file-list">
            <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button class="remove-btn" @click.stop="removeFile(index)">×</button>
            </div>
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploadProgress.length > 0" class="upload-progress">
          <div
            v-for="(item, index) in uploadProgress"
            :key="index"
            class="progress-item"
          >
            <div class="progress-info">
              <span class="file-name">{{ item.fileName }}</span>
              <span class="progress-percent">{{ item.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: item.progress + '%' }"
              ></div>
            </div>
            <div class="progress-status">
              <span v-if="item.status === 'uploading'" class="status-uploading">
                上传中...
              </span>
              <span v-else-if="item.status === 'success'" class="status-success">
                ✓ 成功
              </span>
              <span v-else-if="item.status === 'error'" class="status-error">
                ✗ {{ item.error }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="upload-actions">
          <button
            class="upload-btn"
            @click="startUpload"
            :disabled="selectedFiles.length === 0 || isUploading"
          >
            {{ isUploading ? '上传中...' : `开始上传 (${selectedFiles.length})` }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图片展示区域 (保留原有的3D轮播) -->
    <div class="cat-carousel-3d">
      <div
        class="carousel-container"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <!-- 3D轮播展示区域 -->
        <div class="carousel-track">
          <div
            v-for="(image, index) in imageList"
            :key="image.id || index"
            class="carousel-slide"
            :class="{
              'active': index === currentIndex,
              'prev': index === prevIndex,
              'next': index === nextIndex,
              'hidden': !isVisibleSlide(index)
            }"
            @click="goToImage(index)"
            @mouseenter="showMagnifier = index === currentIndex"
            @mouseleave="showMagnifier = false"
          >
            <div class="slide-content">
              <div class="glass-overlay"></div>
              <img
                :src="getCachedImageSrc(image.imageUrl || image, index)"
                :alt="`猫咪图片 ${index + 1}`"
                class="slide-image"
                @load="onImageLoad(index)"
                @error="onImageError(index)"
                @loadstart="onImageLoadStart(index)"
              />
              <div v-if="loadingImages.includes(index) && !loadedImages.has(index)"
                   class="loading-overlay">
                <div class="loading-spinner"></div>
              </div>
              <!-- 放大镜按钮 -->
              <transition name="magnifier-fade">
                <div v-if="index === currentIndex && showMagnifier && loadedImages.has(index)"
                     class="magnifier-btn"
                     @click.stop="openImageViewer(index)">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="11" cy="11" r="3" fill="currentColor"/>
                  </svg>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- 左右切换按钮 -->
        <transition name="nav-fade">
          <button
            v-show="showNavButtons && imageList.length > 1"
            class="nav-button prev"
            @click="prevImage"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </button>
        </transition>

        <transition name="nav-fade">
          <button
            v-show="showNavButtons && imageList.length > 1"
            class="nav-button next"
            @click="nextImage"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </button>
        </transition>

        <!-- 指示器 -->
        <div class="indicators" v-if="imageList.length > 1">
          <button
            v-for="(image, index) in imageList"
            :key="image.id || index"
            class="indicator"
            :class="{ active: index === currentIndex }"
            @click="goToImage(index)"
          ></button>
        </div>
      </div>
    </div>

    <!-- 图片操作工具栏 -->
    <div class="image-toolbar" v-if="imageList.length > 0 && imageList[currentIndex]?.id">
      <div class="toolbar-left">
        <span class="current-image-info">
          {{ imageList[currentIndex]?.petName || '未分类' }}
          <span v-if="imageList[currentIndex]?.description" class="description">
            - {{ imageList[currentIndex]?.description }}
          </span>
        </span>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn edit-btn" @click="openEditModal(imageList[currentIndex])">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
          </svg>
          编辑
        </button>
        <button class="toolbar-btn delete-btn" @click="confirmDeleteImage(imageList[currentIndex])">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
          删除
        </button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="toggle-upload-btn" @click="toggleUploadPanel">
        {{ showUploadPanel ? '收起上传' : '上传照片' }}
      </button>
      <button class="refresh-btn" @click="loadImagesFromServer">
        🔄 刷新
      </button>
      <button class="list-view-btn" @click="openListView">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
        </svg>
        列表
      </button>
      <span class="image-counter" v-if="showCounter">共 {{ imageList.length }} 张</span>
    </div>

    <!-- 编辑图片弹窗 -->
    <transition name="modal-fade">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>编辑图片信息</h3>
            <button class="modal-close-btn" @click="closeEditModal">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>宠物名称</label>
              <select v-model="editForm.petName" class="form-input">
                <option value="">未分类</option>
                <option value="菠萝包">菠萝包</option>
                <!-- <option value="咪咪">咪咪</option> -->
              </select>
            </div>
            <div class="form-group">
              <label>图片描述</label>
              <textarea
                v-model="editForm.description"
                class="form-input"
                placeholder="添加描述..."
                rows="3"
              ></textarea>
            </div>
            <div class="image-preview" v-if="editForm.imageUrl">
              <img :src="editForm.imageUrl" alt="预览" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn modal-btn-cancel" @click="closeEditModal">取消</button>
            <button class="modal-btn modal-btn-confirm" @click="saveImageEdit" :disabled="isSaving">
              {{ isSaving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 删除确认弹窗 -->
    <transition name="modal-fade">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="closeDeleteConfirm">
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h3>确认删除</h3>
            <button class="modal-close-btn" @click="closeDeleteConfirm">×</button>
          </div>
          <div class="modal-body">
            <p>确定要删除这张图片吗？此操作无法撤销。</p>
          </div>
          <div class="modal-footer">
            <button class="modal-btn modal-btn-cancel" @click="closeDeleteConfirm">取消</button>
            <button class="modal-btn modal-btn-danger" @click="deleteImage" :disabled="isDeleting">
              {{ isDeleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 图片查看器（全屏预览） -->
    <transition name="viewer-fade">
      <div v-if="showImageViewer" class="image-viewer-overlay" @click="closeImageViewer">
        <div class="image-viewer-container" @click.stop>
          <!-- 关闭按钮 -->
          <button class="viewer-close-btn" @click="closeImageViewer">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>

          <!-- 导航按钮 -->
          <button v-if="imageList.length > 1" class="viewer-nav-btn viewer-prev" @click="viewerPrev">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </button>
          <button v-if="imageList.length > 1" class="viewer-nav-btn viewer-next" @click="viewerNext">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </button>

          <!-- 图片展示 -->
          <div class="viewer-image-wrapper">
            <img
              :src="imageList[viewerImageIndex]?.imageUrl || imageList[viewerImageIndex]"
              :alt="`猫咪图片 ${viewerImageIndex + 1}`"
              class="viewer-image"
            />
            <!-- 图片信息 -->
            <div class="viewer-image-info">
              <span v-if="imageList[viewerImageIndex]?.petName" class="viewer-pet-name">
                {{ imageList[viewerImageIndex]?.petName }}
              </span>
              <span v-if="imageList[viewerImageIndex]?.description" class="viewer-description">
                {{ imageList[viewerImageIndex]?.description }}
              </span>
              <span class="viewer-counter">{{ viewerImageIndex + 1 }} / {{ imageList.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 列表视图 -->
    <transition name="list-slide">
      <div v-if="showListView" class="list-view-overlay">
        <div class="list-view-container">
          <!-- 列表头部 -->
          <div class="list-view-header">
            <h2>照片列表</h2>
            <button class="list-view-close-btn" @click="closeListView">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <!-- iOS风格网格列表 -->
          <div class="image-grid-list">
            <div
              v-for="(image, index) in imageList"
              :key="image.id || index"
              class="grid-item"
              @click="openImageViewer(index)"
            >
              <div class="grid-item-image">
                <img
                  :src="image.imageUrl || image"
                  :alt="`猫咪图片 ${index + 1}`"
                  loading="lazy"
                />
                <div class="grid-item-overlay">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="grid-item-info">
                <span class="grid-item-pet">{{ image.petName || '未分类' }}</span>
                <span class="grid-item-desc">{{ image.description || '暂无描述' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import OSS from 'ali-oss'

// Props
const props = defineProps({
  // 兼容旧的 list prop
  list: {
    type: Array,
    default: () => []
  },
  apiBase: {
    type: String,
    // default: 'http://localhost:8091'
    default: 'https://api.blazing3service.site'
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  autoPlayInterval: {
    type: Number,
    default: 4000
  },
  showCounter: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '450px'
  }
})

// 状态
const currentIndex = ref(0)
const autoPlayTimer = ref(null)
const showNavButtons = ref(false)
const loadingImages = ref([])
const loadedImages = ref(new Set())
const imageCache = ref(new Map())
const touchStartTime = ref(0)

// 上传相关状态
const showUploadPanel = ref(false)
const selectedFiles = ref([])
const selectedPetName = ref('')
const imageDescription = ref('')
const uploadProgress = ref([])
const isUploading = ref(false)
const isDragOver = ref(false)

// 图片列表
const imageList = ref([])

// 编辑相关状态
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const editForm = ref({
  id: null,
  petName: '',
  description: '',
  imageUrl: ''
})
const imageToDelete = ref(null)

// 放大镜相关状态
const showMagnifier = ref(false)
const showImageViewer = ref(false)
const viewerImageIndex = ref(0)

// 列表视图相关状态
const showListView = ref(false)

// OSS客户端
let ossClient = null

// 计算属性
const prevIndex = computed(() => {
  return currentIndex.value === 0
    ? imageList.value.length - 1
    : currentIndex.value - 1
})

const nextIndex = computed(() => {
  return (currentIndex.value + 1) % imageList.value.length
})

// 获取OSS上传凭证
const getUploadSignature = async () => {
  try {
    const response = await fetch(`${props.apiBase}/pet/cat/image/upload-signature`)
    const result = await response.json()

    if (result.success) {
      return result.data
    } else {
      throw new Error(result.message || '获取签名失败')
    }
  } catch (error) {
    console.error('获取上传签名失败:', error)
    throw error
  }
}

// 初始化OSS客户端
const initOssClient = async () => {
  try {
    const signature = await getUploadSignature()

    ossClient = new OSS({
      region: signature.region,
      accessKeyId: signature.accessKeyId,
      accessKeySecret: signature.accessKeySecret,
      stsToken: signature.securityToken,
      bucket: signature.bucket,
      secure: true,
      timeout: 120000 // 2分钟超时
    })

    return signature
  } catch (error) {
    console.error('初始化OSS客户端失败:', error)
    throw error
  }
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
  event.target.value = '' // 重置input
}

// 处理拖放
const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files).filter(
    file => file.type.startsWith('image/')
  )
  selectedFiles.value = [...selectedFiles.value, ...files]
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 清空选择
const clearSelection = () => {
  selectedFiles.value = []
  uploadProgress.value = []
  imageDescription.value = ''
}

// 开始上传
const startUpload = async () => {
  if (selectedFiles.value.length === 0) return

  isUploading.value = true

  try {
    // 初始化OSS客户端
    const signature = await initOssClient()

    // 逐个上传
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]

      // 初始化进度
      uploadProgress.value.push({
        fileName: file.name,
        progress: 0,
        status: 'uploading',
        error: null
      })

      try {
        // 生成对象路径
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = file.name.split('.').pop()
        const objectKey = `${signature.uploadPrefix}${dateStr}/${timestamp}_${randomStr}.${ext}`

        // 上传到OSS
        const result = await ossClient.put(objectKey, file, {
          progress: (p) => {
            const index = uploadProgress.value.length - 1
            uploadProgress.value[index].progress = Math.floor(p * 100)
          }
        })

        // 保存到数据库
        await saveImageToDatabase({
          petName: selectedPetName.value || null,
          imageUrl: result.url,
          objectKey: objectKey,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          description: imageDescription.value
        })

        // 标记成功
        uploadProgress.value[uploadProgress.value.length - 1].status = 'success'

      } catch (error) {
        console.error(`上传 ${file.name} 失败:`, error)
        uploadProgress.value[uploadProgress.value.length - 1].status = 'error'
        uploadProgress.value[uploadProgress.value.length - 1].error = error.message
      }
    }

    // 上传完成后刷新列表
    await loadImagesFromServer()
    clearSelection()

  } catch (error) {
    console.error('上传过程出错:', error)
    alert('上传失败: ' + error.message)
  } finally {
    isUploading.value = false
  }
}

// 保存图片信息到数据库
const saveImageToDatabase = async (imageData) => {
  try {
    const response = await fetch(`${props.apiBase}/pet/cat/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || '保存失败')
    }

    return result.data
  } catch (error) {
    console.error('保存图片信息失败:', error)
    throw error
  }
}

// 从服务器加载图片列表
const loadImagesFromServer = async () => {
  try {
    const url = selectedPetName.value
      ? `${props.apiBase}/pet/cat/images?petName=${encodeURIComponent(selectedPetName.value)}`
      : `${props.apiBase}/pet/cat/images`

    const response = await fetch(url)
    const result = await response.json()

    if (result.success) {
      // 如果有数据则使用服务器数据，否则使用传入的 list
      imageList.value = result.data.length > 0 ? result.data : props.list
      preloadImages()
    } else {
      throw new Error(result.message || '加载失败')
    }
  } catch (error) {
    console.error('加载图片列表失败:', error)
    // 如果API调用失败，使用传入的 list
    imageList.value = props.list
    preloadImages()
  }
}

// 打开编辑弹窗
const openEditModal = (image) => {
  editForm.value = {
    id: image.id,
    petName: image.petName || '',
    description: image.description || '',
    imageUrl: image.imageUrl
  }
  showEditModal.value = true
}

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    id: null,
    petName: '',
    description: '',
    imageUrl: ''
  }
}

// 保存图片编辑
const saveImageEdit = async () => {
  if (!editForm.value.id) return

  isSaving.value = true
  try {
    const response = await fetch(`${props.apiBase}/pet/cat/image/${editForm.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        petName: editForm.value.petName || null,
        description: editForm.value.description
      })
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || '更新失败')
    }

    // 更新本地列表
    const index = imageList.value.findIndex(img => img.id === editForm.value.id)
    if (index !== -1) {
      imageList.value[index] = {
        ...imageList.value[index],
        petName: editForm.value.petName,
        description: editForm.value.description
      }
    }

    closeEditModal()
  } catch (error) {
    console.error('更新图片信息失败:', error)
    alert('更新失败: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

// 确认删除图片
const confirmDeleteImage = (image) => {
  imageToDelete.value = image
  showDeleteConfirm.value = true
}

// 关闭删除确认
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  imageToDelete.value = null
}

// 删除图片
const deleteImage = async () => {
  if (!imageToDelete.value?.id) return

  isDeleting.value = true
  try {
    const response = await fetch(`${props.apiBase}/pet/cat/image/${imageToDelete.value.id}`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || '删除失败')
    }

    // 从本地列表中移除
    const index = imageList.value.findIndex(img => img.id === imageToDelete.value.id)
    if (index !== -1) {
      imageList.value.splice(index, 1)
      // 清理缓存
      const cacheKey = imageToDelete.value.imageUrl
      imageCache.value.delete(cacheKey)
      loadedImages.value.delete(index)
    }

    // 调整当前索引
    if (currentIndex.value >= imageList.value.length && imageList.value.length > 0) {
      currentIndex.value = imageList.value.length - 1
    }

    closeDeleteConfirm()
  } catch (error) {
    console.error('删除图片失败:', error)
    alert('删除失败: ' + error.message)
  } finally {
    isDeleting.value = false
  }
}

// 切换上传面板
const toggleUploadPanel = () => {
  showUploadPanel.value = !showUploadPanel.value
}

// 轮播相关方法
const preloadImages = () => {
  // 只预加载当前、上一张和下一张
  const indicesToLoad = [currentIndex.value, prevIndex.value, nextIndex.value]

  indicesToLoad.forEach(index => {
    if (index >= 0 && index < imageList.value.length) {
      const img = imageList.value[index]
      const src = img.imageUrl || img
      if (!imageCache.value.has(src)) {
        const image = new Image()
        image.onload = () => {
          imageCache.value.set(src, src)
          loadedImages.value.add(index)
        }
        image.onerror = () => {
          imageCache.value.set(src, src)
        }
        image.src = src
      } else if (imageCache.value.has(src)) {
        loadedImages.value.add(index)
      }
    }
  })
}

const getCachedImageSrc = (imageOrUrl) => {
  const src = typeof imageOrUrl === 'string' ? imageOrUrl : imageOrUrl.imageUrl
  return imageCache.value.get(src) || src
}

// 当索引变化时预加载
const updatePreload = () => {
  preloadImages()
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % imageList.value.length
  updatePreload()
}

const prevImage = () => {
  currentIndex.value = currentIndex.value === 0
    ? imageList.value.length - 1
    : currentIndex.value - 1
  updatePreload()
}

const goToImage = (index) => {
  if (index !== currentIndex.value) {
    currentIndex.value = index
    updatePreload()
  }
}

const isVisibleSlide = (index) => {
  return index === currentIndex.value ||
         index === prevIndex.value ||
         index === nextIndex.value
}

const onImageLoadStart = (index) => {
  if (!loadingImages.value.includes(index)) {
    loadingImages.value.push(index)
  }
}

const onImageLoad = (index) => {
  loadingImages.value = loadingImages.value.filter(i => i !== index)
  loadedImages.value.add(index)
}

const onImageError = (index) => {
  loadingImages.value = loadingImages.value.filter(i => i !== index)
  console.warn('图片加载失败:', imageList.value[index])
}

const onMouseEnter = () => {
  showNavButtons.value = true
  pauseAutoPlay()
}

const onMouseLeave = () => {
  showNavButtons.value = false
  if (props.autoPlay) {
    startAutoPlay()
  }
}

const onTouchStart = () => {
  touchStartTime.value = Date.now()
  pauseAutoPlay()
}

const onTouchEnd = () => {
  if (Date.now() - touchStartTime.value < 200) {
    setTimeout(() => {
      if (props.autoPlay) {
        startAutoPlay()
      }
    }, 2000)
  }
}

// 放大镜和图片查看器相关方法
const openImageViewer = (index) => {
  viewerImageIndex.value = index
  showImageViewer.value = true
  pauseAutoPlay()
}

const closeImageViewer = () => {
  showImageViewer.value = false
  // 同步轮播索引
  currentIndex.value = viewerImageIndex.value
  if (props.autoPlay) {
    startAutoPlay()
  }
}

const viewerPrev = () => {
  viewerImageIndex.value = viewerImageIndex.value === 0
    ? imageList.value.length - 1
    : viewerImageIndex.value - 1
}

const viewerNext = () => {
  viewerImageIndex.value = (viewerImageIndex.value + 1) % imageList.value.length
}

// 列表视图相关方法
const openListView = () => {
  showListView.value = true
  pauseAutoPlay()
}

const closeListView = () => {
  showListView.value = false
  if (props.autoPlay) {
    startAutoPlay()
  }
}

// 自动播放
const startAutoPlay = () => {
  if (autoPlayTimer.value) return
  if (props.autoPlay && imageList.value.length > 1) {
    autoPlayTimer.value = setInterval(() => {
      nextImage()
    }, props.autoPlayInterval)
  }
}

const pauseAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

// 生命周期
onMounted(() => {
  loadImagesFromServer()
  if (props.autoPlay && imageList.value.length > 1) {
    startAutoPlay()
  }
})

onBeforeUnmount(() => {
  pauseAutoPlay()
  // 清理缓存
  imageCache.value.forEach((value) => {
    if (typeof value === 'string' && value.startsWith('blob:')) {
      URL.revokeObjectURL(value)
    }
  })
})
</script>

<style scoped>
.cat-pic-manager {
  width: 100%;
  margin: 1rem 0;
}

/* 上传面板样式 */
.upload-panel {
  position: fixed;
  top: 0;
  right: -420px;
  width: 420px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.upload-panel.show {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #e9ecef;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #FF6B9D;
  background: rgba(255, 107, 157, 0.05);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-weight: 500;
  color: #333;
  margin: 0.5rem 0;
}

.upload-sub-hint {
  font-size: 0.875rem;
  color: #999;
  margin: 0;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.pet-select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

/* 已选文件列表 */
.selected-files {
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.clear-btn {
  background: none;
  border: none;
  color: #FF6B9D;
  cursor: pointer;
  font-size: 0.8rem;
}

.clear-btn:hover {
  text-decoration: underline;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.8rem;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #999;
  font-size: 0.75rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-btn:hover {
  background: #f0f0f0;
  color: #FF6B9D;
}

/* 上传进度 */
.upload-progress {
  margin: 1rem 0;
}

.progress-item {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.file-name {
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-percent {
  color: #FF6B9D;
}

.progress-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #FF6B9D;
  transition: width 0.3s;
}

.progress-status {
  margin-top: 0.25rem;
  font-size: 0.75rem;
}

.status-uploading {
  color: #999;
}

.status-success {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}

/* 操作按钮 */
.upload-actions {
  display: flex;
  gap: 0.5rem;
}

.upload-btn {
  flex: 1;
  padding: 0.75rem;
  background: #FF6B9D;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.upload-btn:hover:not(:disabled) {
  background: #e85a8a;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 轮播容器（保留原有样式） */
.cat-carousel-3d {
  max-width: 100%;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  perspective: 1200px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.carousel-slide {
  position: absolute;
  width: 85%;
  height: 95%;
  left: 50%;
  top: 50%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform-origin: center center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.carousel-slide.active {
  transform: translate(-50%, -50%) translateZ(0) scale(1);
  z-index: 3;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.carousel-slide.prev {
  transform: translate(-50%, -50%) translateZ(-200px) translateX(-120%) rotateY(25deg) scale(0.8);
  z-index: 2;
  opacity: 0.7;
}

.carousel-slide.next {
  transform: translate(-50%, -50%) translateZ(-200px) translateX(120%) rotateY(-25deg) scale(0.8);
  z-index: 2;
  opacity: 0.7;
}

.carousel-slide.hidden {
  transform: translate(-50%, -50%) translateZ(-400px) scale(0.6);
  opacity: 0;
  pointer-events: none;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.1) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.carousel-slide:hover .slide-image {
  transform: scale(1.05);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  z-index: 4;
  color: rgba(255, 255, 255, 0.9);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.1);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.nav-button.prev {
  left: 24px;
}

.nav-button.next {
  right: 24px;
}

.nav-fade-enter-active, .nav-fade-leave-active {
  transition: all 0.3s ease;
}

.nav-fade-enter-from, .nav-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.8);
}

.indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 4;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 12px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.indicator.active {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
  align-items: center;
}

.toggle-upload-btn,
.refresh-btn {
  padding: 0.6rem 1.2rem;
  background: #FF6B9D;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.toggle-upload-btn:hover,
.refresh-btn:hover {
  background: #e85a8a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.image-counter {
  padding: 0.5rem 1rem;
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
  border-radius: 20px;
  font-size: 0.8rem;
}

/* 响应式 */
@media (max-width: 768px) {
  .upload-panel {
    width: 100%;
    right: -100%;
  }

  .carousel-container {
    height: 300px;
  }

  .nav-button {
    width: 48px;
    height: 48px;
  }

  .nav-button.prev {
    left: 16px;
  }

  .nav-button.next {
    right: 16px;
  }

  .image-toolbar {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .toolbar-left {
    width: 100%;
    text-align: center;
  }

  .current-image-info {
    font-size: 0.85rem;
  }

  .toolbar-right {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }

  .toolbar-btn {
    flex: 1;
    justify-content: center;
    padding: 0.6rem 1rem;
  }

  .toolbar-btn svg {
    width: 16px;
    height: 16px;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .toggle-upload-btn,
  .refresh-btn,
  .list-view-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    height: auto;
    line-height: 1.4;
  }

  .toggle-upload-btn svg,
  .refresh-btn svg,
  .list-view-btn svg {
    width: 16px;
    height: 16px;
  }

  .image-counter {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}

/* 图片操作工具栏 */
.image-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.75rem auto 0;
  max-width: 800px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.toolbar-left {
  flex: 1;
  min-width: 0;
}

.current-image-info {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-image-info .description {
  color: #888;
  font-weight: 400;
  margin-left: 0.5rem;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.toolbar-btn svg {
  flex-shrink: 0;
}

.toolbar-btn.edit-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.toolbar-btn.edit-btn:hover {
  background: linear-gradient(135deg, #43A047, #388E3C);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.toolbar-btn.delete-btn {
  background: linear-gradient(135deg, #F44336, #e53935);
  color: white;
}

.toolbar-btn.delete-btn:hover {
  background: linear-gradient(135deg, #E53935, #D32F2F);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-content.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #666;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-body .form-group {
  margin-bottom: 1.25rem;
}

.modal-body .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.modal-body .form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.modal-body .form-input:focus {
  outline: none;
  border-color: #FF6B9D;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.modal-btn-cancel:hover:not(:disabled) {
  background: #e0e0e0;
}

.modal-btn-confirm {
  background: #FF6B9D;
  color: white;
}

.modal-btn-confirm:hover:not(:disabled) {
  background: #e85a8a;
}

.modal-btn-danger {
  background: #F44336;
  color: white;
}

.modal-btn-danger:hover:not(:disabled) {
  background: #d32f2f;
}

/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}

/* ========== 新增样式：放大镜按钮 ========== */
.magnifier-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 5;
  color: rgba(255, 255, 255, 0.9);
}

.magnifier-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.magnifier-fade-enter-active,
.magnifier-fade-leave-active {
  transition: all 0.3s ease;
}

.magnifier-fade-enter-from,
.magnifier-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* ========== 图片查看器样式 ========== */
.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: rgba(255, 255, 255, 0.9);
}

.viewer-close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.viewer-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: rgba(255, 255, 255, 0.9);
}

.viewer-nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.viewer-prev {
  left: 24px;
}

.viewer-next {
  right: 24px;
}

.viewer-image-wrapper {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.viewer-image-info {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.9);
}

.viewer-pet-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.viewer-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.viewer-counter {
  margin-top: 8px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 0.85rem;
}

.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: all 0.3s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}

.viewer-fade-enter-from .image-viewer-container,
.viewer-fade-leave-to .image-viewer-container {
  transform: scale(0.95);
}

/* ========== 列表视图样式 ========== */
.list-view-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.list-view-container {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.list-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(20px);
}

.list-view-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.list-view-close-btn {
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.list-view-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.image-grid-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

/* iOS风格的网格项 */
.grid-item {
  aspect-ratio: 1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-item:hover {
  transform: scale(1.05);
}

.grid-item:active {
  transform: scale(0.98);
}

.grid-item-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.grid-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.grid-item:hover .grid-item-overlay {
  opacity: 1;
}

.grid-item-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.grid-item-pet {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
}

.grid-item-desc {
  font-size: 0.75rem;
  color: #8e8e93;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 列表视图动画 */
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-slide-enter-from,
.list-slide-leave-to {
  opacity: 0;
}

.list-slide-enter-from .list-view-container,
.list-slide-leave-to .list-view-container {
  transform: scale(0.9) translateY(40px);
}

/* ========== 列表按钮样式 ========== */
.list-view-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.list-view-btn:hover {
  background: linear-gradient(135deg, #0066E5 0%, #0047B0 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
}

.list-view-btn svg {
  flex-shrink: 0;
}

/* ========== 滚动条样式 ========== */
.image-grid-list::-webkit-scrollbar {
  width: 8px;
}

.image-grid-list::-webkit-scrollbar-track {
  background: transparent;
}

.image-grid-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.image-grid-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* ========== 响应式调整 ========== */
@media (max-width: 768px) {
  .image-grid-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .list-view-container {
    max-height: 90vh;
  }

  .list-view-header {
    padding: 16px;
  }

  .list-view-header h2 {
    font-size: 1.25rem;
  }

  .viewer-close-btn {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }

  .viewer-nav-btn {
    width: 48px;
    height: 48px;
  }

  .viewer-prev {
    left: 12px;
  }

  .viewer-next {
    right: 12px;
  }

  .viewer-image {
    max-height: 70vh;
  }
}
</style>
