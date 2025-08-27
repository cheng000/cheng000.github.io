preloadImages() {
      // 预加载所有图片到内存缓存
      this.imageList.forEach((src, index) => {
        if (!this.imageCache.has(src)) {
          const img = new Image()
          img.crossOrigin = 'anonymous' // 支持跨域图片
          
          img.onload = () => {
            // 将图片转换为blob URL进行本地缓存
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
            
            canvas.toBlob((blob) => {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob)
                this.imageCache.set(src, blobUrl)
                this.loadedImages.add(index)
                console.log(`图片 ${index + 1} 已缓存到本地`)
              }
            }, 'image/jpeg', 0.9)
          }
          
          img.onerror = () => {
            console.warn(`图片预加载失败: ${src}`)
            // 失败时仍使用原始URL
            this.imageCache.set(src, src)
          }
          
          img.src = src
        }
      })
    },
    
    preloadAdjacentImages(currentIndex) {
      // 预加载当前图片的前后两张图片（智能预加载）
      const adjacentIndices = [
        (currentIndex - 1 + this.imageList.length) % this.imageList.length,
        (currentIndex + 1) % this.imageList.length
      ]
      
      adjacentIndices.forEach(index => {
        const src = this.imageList[index]
        if (src && !this.imageCache.has(src)) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
            
            canvas.toBlob((blob) => {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob)
                this.imageCache.set(src, blobUrl)
                this.loadedImages.add(index)
              }
            }, 'image/jpeg', 0.9)
          }
          
          img.onerror = () => {
            this.imageCache.set(src, src)
          }
          
          img.src = src
        }
      })
    }<template>
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
          :key="index"
          class="carousel-slide"
          :class="{
            'active': index === currentIndex,
            'prev': index === prevIndex,
            'next': index === nextIndex,
            'hidden': !isVisibleSlide(index)
          }"
          @click="goToImage(index)"
        >
          <div class="slide-content">
            <div class="glass-overlay"></div>
            <img 
              :src="getCachedImageSrc(image, index)" 
              :alt="`猫咪图片 ${index + 1}`"
              class="slide-image"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
              @loadstart="onImageLoadStart(index)"
            />
            <div v-if="loadingImages.includes(index) && !loadedImages.has(index)" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 左右切换按钮 - 悬停时显示 -->
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
          :key="index"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToImage(index)"
        ></button>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'CatCarousel3D',
  props: {
    list: {
      type: Array,
      default: () => [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1581888227599-779811939961?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop'
      ]
    },
    autoPlayInterval: {
      type: Number,
      default: 4000
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    showCounter: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '450px'
    }
  },
  data() {
    return {
      currentIndex: 0,
      autoPlayTimer: null,
      showNavButtons: false,
      loadingImages: [],
      loadedImages: new Set(),
      imageCache: new Map(),
      touchStartTime: 0
    }
  },
  computed: {
    imageList() {
      return this.list.length > 0 ? this.list : [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop'
      ]
    },
    prevIndex() {
      return this.currentIndex === 0 
        ? this.imageList.length - 1 
        : this.currentIndex - 1
    },
    nextIndex() {
      return (this.currentIndex + 1) % this.imageList.length
    }
  },
  mounted() {
    // 预加载所有图片到内存缓存
    this.preloadImages()
    
    if (this.autoPlay && this.imageList.length > 1) {
      this.startAutoPlay()
    }
  },
  beforeUnmount() {
    this.clearAutoPlay()
    this.clearImageCache()
  },
  methods: {
  // 预加载所有图片（默认直接使用浏览器缓存）
  preloadImages() {
    this.imageList.forEach((src, index) => {
      if (!this.imageCache.has(src)) {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          // 这里直接用原始 src（浏览器已有缓存），避免额外 blob 开销
          this.imageCache.set(src, src)
          this.cachedImages.add(index)
          console.log(`图片 ${index + 1} 已缓存`)
        }

        img.onerror = () => {
          console.warn(`图片预加载失败: ${src}`)
          this.imageCache.set(src, src) // 失败时也存原始地址，避免后续空引用
        }

        img.src = src
      }
    })
  },

  // 预加载相邻图片
  preloadAdjacentImages(currentIndex) {
    const adjacentIndices = [
      (currentIndex - 1 + this.imageList.length) % this.imageList.length,
      (currentIndex + 1) % this.imageList.length
    ]

    adjacentIndices.forEach(index => {
      const src = this.imageList[index]
      if (src && !this.imageCache.has(src)) {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          this.imageCache.set(src, src)
          this.cachedImages.add(index)
        }

        img.onerror = () => {
          this.imageCache.set(src, src)
        }

        img.src = src
      }
    })
  },

  // 清理缓存，释放 blob URL
  clearImageCache() {
    this.imageCache.forEach((value) => {
      if (typeof value === 'string' && value.startsWith('blob:')) {
        URL.revokeObjectURL(value)
      }
    })
    this.imageCache.clear()
    this.cachedImages.clear()
  },

  getCachedImageSrc(originalSrc) {
    return this.imageCache.get(originalSrc) || originalSrc
  },

  onImageLoadStart(index) {
    if (!this.loadingImages.includes(index)) {
      this.loadingImages.push(index)
    }
  },
  onImageLoad(index) {
    this.loadingImages = this.loadingImages.filter(i => i !== index)
    this.loadedImages.add(index)
  },
  onImageError(index) {
    this.loadingImages = this.loadingImages.filter(i => i !== index)
    console.warn('图片加载失败:', this.imageList[index])
  },
  isVisibleSlide(index) {
    return (
      index === this.currentIndex ||
      index === this.prevIndex ||
      index === this.nextIndex
    )
  },
  // 自动播放启动
  startAutoPlay() {
    // 避免重复创建 timer
    if (this.autoPlayTimer) return
    if (this.autoPlay && this.imageList.length > 1) {
      this.autoPlayTimer = setInterval(() => {
        this.nextImage()
      }, this.autoPlayInterval)
    }
  },

  // 暂停/清理自动播放
  pauseAutoPlay() {
    this.clearAutoPlay()
  },
  clearAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
      this.autoPlayTimer = null
    }
  },

  // 预加载（使用之前给你的简化版本）
  preloadImages() {
    this.imageList.forEach((src, index) => {
      if (!this.imageCache.has(src)) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          this.imageCache.set(src, src)
          this.cachedImages.add(index)
        }
        img.onerror = () => {
          this.imageCache.set(src, src)
        }
        img.src = src
      }
    })
  },

  preloadAdjacentImages(currentIndex) {
    const adjacent = [
      (currentIndex - 1 + this.imageList.length) % this.imageList.length,
      (currentIndex + 1) % this.imageList.length
    ]
    adjacent.forEach(index => {
      const src = this.imageList[index]
      if (src && !this.imageCache.has(src)) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          this.imageCache.set(src, src)
          this.cachedImages.add(index)
        }
        img.onerror = () => {
          this.imageCache.set(src, src)
        }
        img.src = src
      }
    })
  },

  // 清理缓存（如果存在 blob URL 则 revoke）
  clearImageCache() {
    this.imageCache.forEach((value) => {
      if (typeof value === 'string' && value.startsWith('blob:')) {
        URL.revokeObjectURL(value)
      }
    })
    this.imageCache.clear()
    this.cachedImages.clear()
  },

  // 其余方法（导航/显示/图片事件等），确保存在：
  nextImage() { this.currentIndex = (this.currentIndex + 1) % this.imageList.length },
  prevImage() { this.currentIndex = this.currentIndex === 0 ? this.imageList.length - 1 : this.currentIndex - 1 },
  goToImage(index) { if (index !== this.currentIndex) this.currentIndex = index },

  isVisibleSlide(index) {
    return index === this.currentIndex || index === this.prevIndex || index === this.nextIndex
  },

  onImageLoadStart(index) {
    if (!this.loadingImages.includes(index)) this.loadingImages.push(index)
  },
  onImageLoad(index) {
    this.loadingImages = this.loadingImages.filter(i => i !== index)
    this.loadedImages.add(index)
  },
  onImageError(index) {
    this.loadingImages = this.loadingImages.filter(i => i !== index)
    console.warn('图片加载失败:', this.imageList[index])
  },

  onMouseEnter() { this.showNavButtons = true; this.pauseAutoPlay() },
  onMouseLeave() { this.showNavButtons = false; if (this.autoPlay) this.startAutoPlay() },
  onTouchStart() { this.touchStartTime = Date.now(); this.pauseAutoPlay() },
  onTouchEnd() {
    if (Date.now() - this.touchStartTime < 200) {
      setTimeout(()=> { if (this.autoPlay) this.startAutoPlay() }, 2000)
    }
  }
},

data() {
  return {
    currentIndex: 0,
    autoPlayTimer: null,
    showNavButtons: false,
    loadingImages: [],
    loadedImages: new Set(), // UI 上实际加载完成的
    cachedImages: new Set(), // 预加载（缓存完成的）
    imageCache: new Map(),
    touchStartTime: 0
  }
},

  watch: {
    currentIndex(newIndex) {
      // 预加载相邻图片
      this.preloadAdjacentImages(newIndex)
    },
    list: {
      handler() {
        this.currentIndex = 0
        this.loadingImages = []
        this.loadedImages.clear()
        this.clearImageCache()
        this.clearAutoPlay()
        
        // 重新预加载新的图片列表
        this.$nextTick(() => {
          this.preloadImages()
          if (this.autoPlay && this.imageList.length > 1) {
            this.startAutoPlay()
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped>
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

.image-counter {
  text-align: center;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-slide {
    width: 92%;
    height: 90%;
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
  
  .indicators {
    bottom: 12px;
    gap: 6px;
    padding: 4px 10px;
  }
  
  .indicator {
    width: 7px;
    height: 7px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 300px;
    border-radius: 16px;
  }
  
  .carousel-slide {
    width: 95%;
    height: 88%;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .nav-button.prev {
    left: 12px;
  }
  
  .nav-button.next {
    right: 12px;
  }
  
  .indicators {
    bottom: 8px;
    gap: 5px;
    padding: 3px 8px;
  }
  
  .indicator {
    width: 6px;
    height: 6px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .carousel-container {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .slide-content {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .image-counter {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>